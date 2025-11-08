import { HeaderForm } from './HeaderForm.js';

/**
 * Step-by-step results component for selecting flights and hotels
 */
export class StepByStepResults {
    constructor(containerId, onSearch) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.onSearch = onSearch;
        this.currentStep = 1;
        this.selectedFlights = {
            outbound: [],
            return: []
        };
        this.selectedHotels = [];
        this.allResults = null;
        this.searchParams = null;
        this.initialized = false;
    }

    init() {
        this.render();
        this.attachEventListeners();
    }

    render() {
        if (!this.container) {
            console.error('Container not available for rendering');
            return;
        }
        
        this.container.innerHTML = `
            <div class="step-results-container">
                <div id="headerFormContainer"></div>
                
                <div class="step-navigation">
                    <div class="step-indicator">
                        <div class="step ${this.currentStep >= 1 ? 'active' : ''} ${this.currentStep > 1 ? 'completed' : ''}">
                            <span class="step-number">1</span>
                            <span class="step-label">Choose Outbound Flight</span>
                        </div>
                        <div class="step ${this.currentStep >= 2 ? 'active' : ''} ${this.currentStep > 2 ? 'completed' : ''}">
                            <span class="step-number">2</span>
                            <span class="step-label">Choose Return Flight</span>
                        </div>
                        <div class="step ${this.currentStep >= 3 ? 'active' : ''} ${this.currentStep > 3 ? 'completed' : ''}">
                            <span class="step-number">3</span>
                            <span class="step-label">Choose Hotels</span>
                        </div>
                        <div class="step ${this.currentStep >= 4 ? 'active' : ''}">
                            <span class="step-number">4</span>
                            <span class="step-label">View Combinations</span>
                        </div>
                    </div>
                </div>

                <div class="step-content" id="stepContent">
                    <!-- Step content will be rendered here -->
                </div>
            </div>
        `;
        
        this.initializeHeaderForm();
        this.renderCurrentStep();
    }

    initializeHeaderForm() {
        const headerContainer = this.container.querySelector('#headerFormContainer');
        if (headerContainer) {
            this.headerForm = new HeaderForm('headerFormContainer', this.onSearch);
            
            // Populate form with current search parameters
            if (this.searchParams) {
                this.headerForm.populateForm(this.searchParams);
            }
        }
    }

    displayResults(combinedResults, searchParams) {
        // Ensure container is available
        this.container = document.getElementById(this.containerId);
        if (!this.container) {
            console.error('Container not found:', this.containerId);
            return;
        }
        
        this.allResults = combinedResults;
        this.searchParams = searchParams;
        this.currentStep = 1;
        this.selectedFlights = { outbound: [], return: [] };
        this.selectedHotels = [];
        
        // Initialize if not already done
        if (!this.initialized) {
            this.init();
            this.initialized = true;
        } else {
            this.render();
        }
    }

    renderCurrentStep() {
        if (!this.container) {
            console.error('Container not available for rendering current step');
            return;
        }
        
        const stepContent = this.container.querySelector('#stepContent');
        if (!stepContent) {
            console.error('Step content element not found');
            return;
        }
        
        switch (this.currentStep) {
            case 1:
                this.renderOutboundFlights();
                break;
            case 2:
                this.renderReturnFlights();
                break;
            case 3:
                this.renderHotels();
                break;
            case 4:
                this.renderCombinations();
                break;
        }
    }

    renderOutboundFlights() {
        const flights = this.allResults.flights.filter(flight => 
            !flight.returnDate || flight.returnDate === null
        );
        
        console.log('Rendering outbound flights - NO GROUPING, flat list:', flights.length);
        
        this.container.querySelector('#stepContent').innerHTML = `
            <div class="step-header">
                <h2>Choose Your Outbound Flights</h2>
                <p>Select one or more flights you prefer for your departure</p>
            </div>
            
            <div class="results-list">
                <div class="flight-options">
                    ${flights.map(flight => this.renderFlightOption(flight, 'outbound')).join('')}
                </div>
            </div>
            
            <div class="step-actions">
                <button class="next-button" ${this.selectedFlights.outbound.length > 0 ? '' : 'disabled'} onclick="window.stepResults.nextStep()">
                    Next: Choose Return Flight
                </button>
            </div>
        `;
    }

    renderReturnFlights() {
        const flights = this.allResults.flights.filter(flight => 
            flight.returnDate && flight.returnDate !== null
        );
        
        console.log('Rendering return flights - NO GROUPING, flat list:', flights.length);
        
        this.container.querySelector('#stepContent').innerHTML = `
            <div class="step-header">
                <h2>Choose Your Return Flights</h2>
                <p>Select one or more flights you prefer for your return journey</p>
            </div>
            
            <div class="results-list">
                <div class="flight-options">
                    ${flights.map(flight => this.renderFlightOption(flight, 'return')).join('')}
                </div>
            </div>
            
            <div class="step-actions">
                <button class="back-button" onclick="window.stepResults.previousStep()">
                    Back: Choose Outbound Flight
                </button>
                <button class="next-button" ${this.selectedFlights.return.length > 0 ? '' : 'disabled'} onclick="window.stepResults.nextStep()">
                    Next: Choose Hotels
                </button>
            </div>
        `;
    }

    renderHotels() {
        console.log('Rendering hotels - NO GROUPING, flat list:', this.allResults.hotels.length);
        
        this.container.querySelector('#stepContent').innerHTML = `
            <div class="step-header">
                <h2>Choose Your Hotels</h2>
                <p>Select one or more hotels you're interested in</p>
            </div>
            
            <div class="results-list">
                <div class="hotel-options">
                    ${this.allResults.hotels.map(hotel => this.renderHotelOption(hotel)).join('')}
                </div>
            </div>
            
            <div class="step-actions">
                <button class="back-button" onclick="window.stepResults.previousStep()">
                    Back: Choose Return Flight
                </button>
                <button class="next-button" ${this.selectedHotels.length > 0 ? '' : 'disabled'} onclick="window.stepResults.nextStep()">
                    Next: View Combinations
                </button>
            </div>
        `;
    }

    renderCombinations() {
        const combinations = this.generateCombinations();
        
        this.container.querySelector('#stepContent').innerHTML = `
            <div class="step-header">
                <h2>Your Travel Combinations</h2>
                <p>Here are all possible combinations of your selected flights and hotels</p>
            </div>
            
            <div class="combinations-grid">
                ${combinations.map((combo, index) => this.renderCombination(combo, index)).join('')}
            </div>
            
            <div class="step-actions">
                <button class="back-button" onclick="window.stepResults.previousStep()">
                    Back: Choose Hotels
                </button>
                <button class="restart-button" onclick="window.stepResults.restart()">
                    Start Over
                </button>
            </div>
        `;
    }

    renderFlightOption(flight, type) {
        const isSelected = this.selectedFlights[type].some(f => f.id === flight.id);
        
        return `
            <div class="flight-option list-item ${isSelected ? 'selected' : ''}" onclick="window.stepResults.selectFlight('${flight.id}', '${type}')">
                <div class="list-item-main">
                    <div class="list-item-route">
                        <div class="route-segment">
                            <div class="route-time">${flight.departureTime}</div>
                            <div class="route-location">${flight.origin}</div>
                        </div>
                        <div class="route-connector">
                            <div class="route-duration">${flight.duration}</div>
                            <div class="route-stops">${flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}</div>
                        </div>
                        <div class="route-segment">
                            <div class="route-time">${flight.arrivalTime}</div>
                            <div class="route-location">${flight.destination}</div>
                        </div>
                    </div>
                    <div class="list-item-airline">
                        <div class="airline-name">${flight.airline}</div>
                        <div class="flight-number">${flight.id}</div>
                        <div class="source-badge">${flight.source}</div>
                    </div>
                    <div class="list-item-price">
                        <div class="price-amount">$${flight.price}</div>
                        <div class="price-currency">${flight.currency}</div>
                    </div>
                </div>
                ${isSelected ? '<div class="selected-indicator">✓ Selected</div>' : ''}
            </div>
        `;
    }

    renderHotelOption(hotel) {
        const isSelected = this.selectedHotels.some(h => h.id === hotel.id);
        
        return `
            <div class="hotel-option list-item ${isSelected ? 'selected' : ''}" onclick="window.stepResults.toggleHotel('${hotel.id}')">
                <div class="list-item-main">
                    <div class="list-item-info">
                        <div class="hotel-name-header">
                            <div class="hotel-name">${hotel.name}</div>
                            <div class="source-badge">${hotel.source}</div>
                        </div>
                        <div class="hotel-location">${hotel.location}</div>
                        <div class="hotel-rating">
                            <span class="stars">${'★'.repeat(Math.floor(hotel.rating))}</span>
                            <span class="rating-value">${hotel.rating}</span>
                        </div>
                        <div class="hotel-amenities">
                            ${hotel.amenities.slice(0, 5).map(amenity => `
                                <span class="amenity-tag">${amenity}</span>
                            `).join('')}
                        </div>
                    </div>
                    <div class="list-item-price">
                        <div class="price-amount">$${hotel.price}</div>
                        <div class="price-currency">${hotel.currency}/night</div>
                    </div>
                </div>
                ${isSelected ? '<div class="selected-indicator">✓ Selected</div>' : ''}
            </div>
        `;
    }

    renderCombination(combo, index) {
        const totalPrice = combo.outboundFlight.price + combo.returnFlight.price + 
                          (combo.hotel.price * this.calculateNights());
        
        return `
            <div class="combination-card">
                <div class="combination-header">
                    <h3>Option ${index + 1}</h3>
                    <div class="total-price">
                        <span class="amount">$${totalPrice}</span>
                        <span class="currency">Total</span>
                    </div>
                </div>
                
                <div class="combination-details">
                    <div class="flight-summary">
                        <h4>Flights</h4>
                        <div class="flight-item">
                            <span class="flight-type">Outbound:</span>
                            <span class="flight-info">${combo.outboundFlight.airline} - $${combo.outboundFlight.price}</span>
                        </div>
                        <div class="flight-item">
                            <span class="flight-type">Return:</span>
                            <span class="flight-info">${combo.returnFlight.airline} - $${combo.returnFlight.price}</span>
                        </div>
                    </div>
                    
                    <div class="hotel-summary">
                        <h4>Hotel</h4>
                        <div class="hotel-item">
                            <span class="hotel-name">${combo.hotel.name}</span>
                            <span class="hotel-price">$${combo.hotel.price}/night</span>
                        </div>
                    </div>
                </div>
                
                <div class="combination-actions">
                    <a href="${combo.outboundFlight.bookingUrl}" target="_blank" class="book-button">
                        Book Outbound Flight
                    </a>
                    <a href="${combo.returnFlight.bookingUrl}" target="_blank" class="book-button">
                        Book Return Flight
                    </a>
                    <a href="${combo.hotel.bookingUrl}" target="_blank" class="book-button">
                        Book Hotel
                    </a>
                </div>
            </div>
        `;
    }

    selectFlight(flightId, type) {
        const flight = this.allResults.flights.find(f => f.id === flightId);
        const existingIndex = this.selectedFlights[type].findIndex(f => f.id === flightId);
        
        if (existingIndex >= 0) {
            // Remove if already selected
            this.selectedFlights[type].splice(existingIndex, 1);
        } else {
            // Add if not selected
            this.selectedFlights[type].push(flight);
        }
        
        this.renderCurrentStep();
        this.updateStepIndicator();
    }

    toggleHotel(hotelId) {
        const hotel = this.allResults.hotels.find(h => h.id === hotelId);
        const existingIndex = this.selectedHotels.findIndex(h => h.id === hotelId);
        
        if (existingIndex >= 0) {
            this.selectedHotels.splice(existingIndex, 1);
        } else {
            this.selectedHotels.push(hotel);
        }
        
        this.renderCurrentStep();
        this.updateStepIndicator();
    }

    nextStep() {
        if (this.currentStep < 4) {
            this.currentStep++;
            this.render();
        }
    }

    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.render();
        }
    }

    restart() {
        this.currentStep = 1;
        this.selectedFlights = { outbound: [], return: [] };
        this.selectedHotels = [];
        this.render();
    }

    generateCombinations() {
        const combinations = [];
        
        // Generate all possible combinations
        for (const outboundFlight of this.selectedFlights.outbound) {
            for (const returnFlight of this.selectedFlights.return) {
                for (const hotel of this.selectedHotels) {
                    combinations.push({
                        outboundFlight: outboundFlight,
                        returnFlight: returnFlight,
                        hotel: hotel
                    });
                }
            }
        }
        
        return combinations;
    }

    calculateNights() {
        if (!this.searchParams?.hotels?.checkIn || !this.searchParams?.hotels?.checkOut) {
            return 3; // Default 3 nights
        }
        
        const checkIn = new Date(this.searchParams.hotels.checkIn);
        const checkOut = new Date(this.searchParams.hotels.checkOut);
        const diffTime = Math.abs(checkOut - checkIn);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    groupResultsBySource(results) {
        return results.reduce((groups, result) => {
            const source = result.source;
            if (!groups[source]) {
                groups[source] = [];
            }
            groups[source].push(result);
            return groups;
        }, {});
    }

    updateStepIndicator() {
        // Update step indicators based on current state
        const steps = this.container.querySelectorAll('.step');
        steps.forEach((step, index) => {
            step.classList.remove('active', 'completed');
            if (index + 1 < this.currentStep) {
                step.classList.add('completed');
            } else if (index + 1 === this.currentStep) {
                step.classList.add('active');
            }
        });
    }

    attachEventListeners() {
        // Make methods globally accessible
        window.stepResults = this;
    }
}
