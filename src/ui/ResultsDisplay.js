import { HeaderForm } from './HeaderForm.js';

/**
 * Results display component for showing flight and hotel search results
 */
export class ResultsDisplay {
    constructor(containerId, onSearch) {
        this.container = document.getElementById(containerId);
        this.onSearch = onSearch;
        this.results = [];
        this.currentService = null;
        this.headerForm = null;
        this.currentSearchParams = null;
    }

    show() {
        this.container.classList.remove('hidden');
    }

    hide() {
        this.container.classList.add('hidden');
    }

    displayResults(service, results) {
        this.currentService = service;
        this.results = results;
        this.render();
        this.show();
    }

    displayCombinedResults(combinedResults, searchParams = null) {
        this.currentService = 'combined';
        this.results = combinedResults;
        this.currentSearchParams = searchParams;
        this.renderCombinedResults();
        this.show();
    }

    render() {
        if (this.currentService === 'flights') {
            this.renderFlightResults();
        } else if (this.currentService === 'hotels') {
            this.renderHotelResults();
        } else if (this.currentService === 'combined') {
            this.renderCombinedResults();
        }
    }

    renderCombinedResults() {
        const { flights, hotels } = this.results;
        const flightGroupedResults = this.groupResultsBySource(flights);
        const hotelGroupedResults = this.groupResultsBySource(hotels);
        
        this.container.innerHTML = `
            <div class="results-container">
                <div id="headerFormContainer"></div>
                <div class="results-header">
                    <h2>Search Results</h2>
                </div>
                
                <div class="results-summary">
                    <p>Found ${flights.length} flights and ${hotels.length} hotels from ${Object.keys(flightGroupedResults).length + Object.keys(hotelGroupedResults).length} sources</p>
                </div>

                <div class="results-content">
                    <!-- Flights Section -->
                    <div class="service-section">
                        <h3 class="service-title">✈️ Flights</h3>
                        ${Object.entries(flightGroupedResults).map(([source, flights]) => `
                            <div class="source-section">
                                <h4 class="source-title">${source}</h4>
                                <div class="results-grid">
                                    ${flights.map(flight => this.renderFlightCard(flight)).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <!-- Hotels Section -->
                    <div class="service-section">
                        <h3 class="service-title">🏨 Hotels</h3>
                        ${Object.entries(hotelGroupedResults).map(([source, hotels]) => `
                            <div class="source-section">
                                <h4 class="source-title">${source}</h4>
                                <div class="results-grid">
                                    ${hotels.map(hotel => this.renderHotelCard(hotel)).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        // Initialize header form after rendering
        this.initializeHeaderForm();
    }

    initializeHeaderForm() {
        const headerContainer = this.container.querySelector('#headerFormContainer');
        if (headerContainer && !this.headerForm) {
            this.headerForm = new HeaderForm('headerFormContainer', this.onSearch);
            
            // Populate form with current search parameters
            if (this.currentSearchParams) {
                this.headerForm.populateForm(this.currentSearchParams);
            }
        }
    }

    renderFlightResults() {
        const groupedResults = this.groupResultsBySource(this.results);
        
        this.container.innerHTML = `
            <div class="results-container">
                <div class="results-header">
                    <h2>Flight Search Results</h2>
                </div>
                
                <div class="results-summary">
                    <p>Found ${this.results.length} flights from ${Object.keys(groupedResults).length} sources</p>
                </div>

                <div class="results-content">
                    ${Object.entries(groupedResults).map(([source, flights]) => `
                        <div class="source-section">
                            <h3 class="source-title">${source}</h3>
                            <div class="results-grid">
                                ${flights.map(flight => this.renderFlightCard(flight)).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderHotelResults() {
        const groupedResults = this.groupResultsBySource(this.results);
        
        this.container.innerHTML = `
            <div class="results-container">
                <div class="results-header">
                    <h2>Hotel Search Results</h2>
                </div>
                
                <div class="results-summary">
                    <p>Found ${this.results.length} hotels from ${Object.keys(groupedResults).length} sources</p>
                </div>

                <div class="results-content">
                    ${Object.entries(groupedResults).map(([source, hotels]) => `
                        <div class="source-section">
                            <h3 class="source-title">${source}</h3>
                            <div class="results-grid">
                                ${hotels.map(hotel => this.renderHotelCard(hotel)).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderFlightCard(flight) {
        return `
            <div class="result-card flight-card">
                <div class="card-header">
                    <div class="airline-info">
                        <span class="airline">${flight.airline}</span>
                        <span class="flight-id">${flight.id}</span>
                    </div>
                    <div class="price">
                        <span class="amount">$${flight.price}</span>
                        <span class="currency">${flight.currency}</span>
                    </div>
                </div>
                
                <div class="flight-details">
                    <div class="route">
                        <div class="departure">
                            <span class="time">${flight.departureTime}</span>
                            <span class="location">${flight.origin}</span>
                        </div>
                        <div class="flight-info">
                            <span class="duration">${flight.duration}</span>
                            <span class="stops">${flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}</span>
                        </div>
                        <div class="arrival">
                            <span class="time">${flight.arrivalTime}</span>
                            <span class="location">${flight.destination}</span>
                        </div>
                    </div>
                </div>
                
                <div class="card-actions">
                    <a href="${flight.bookingUrl}" target="_blank" class="book-button">
                        Book on ${flight.source}
                    </a>
                </div>
            </div>
        `;
    }

    renderHotelCard(hotel) {
        return `
            <div class="result-card hotel-card">
                <div class="card-header">
                    <div class="hotel-info">
                        <h4 class="hotel-name">${hotel.name}</h4>
                        <div class="rating">
                            <span class="stars">${'★'.repeat(Math.floor(hotel.rating))}</span>
                            <span class="rating-value">${hotel.rating}</span>
                        </div>
                    </div>
                    <div class="price">
                        <span class="amount">$${hotel.price}</span>
                        <span class="currency">${hotel.currency}/night</span>
                    </div>
                </div>
                
                <div class="hotel-details">
                    <div class="location">
                        <span class="location-text">${hotel.location}</span>
                    </div>
                    
                    <div class="amenities">
                        ${hotel.amenities.map(amenity => `
                            <span class="amenity">${amenity}</span>
                        `).join('')}
                    </div>
                    
                    <div class="dates">
                        <span class="check-in">Check-in: ${this.formatDate(hotel.checkIn)}</span>
                        <span class="check-out">Check-out: ${this.formatDate(hotel.checkOut)}</span>
                    </div>
                </div>
                
                <div class="card-actions">
                    <a href="${hotel.bookingUrl}" target="_blank" class="book-button">
                        Book on ${hotel.source}
                    </a>
                </div>
            </div>
        `;
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

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    showLoading() {
        const serviceText = this.currentService === 'combined' ? 'flights and hotels' : this.currentService;
        this.container.innerHTML = `
            <div class="results-container">
                <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <h2>Searching for ${serviceText}...</h2>
                    <p>Please wait while we search multiple sources</p>
                </div>
            </div>
        `;
        this.show();
    }

    showError(message) {
        this.container.innerHTML = `
            <div class="results-container">
                <div class="error-state">
                    <h2>Search Error</h2>
                    <p>${message}</p>
                </div>
            </div>
        `;
        this.show();
    }
}
