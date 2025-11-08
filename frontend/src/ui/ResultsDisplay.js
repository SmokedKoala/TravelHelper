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
        
        this.container.innerHTML = `
            <div class="results-container">
                <div id="headerFormContainer"></div>
                <div class="results-header">
                    <h2>Search Results</h2>
                </div>
                
                <div class="results-summary">
                    <p>Found ${flights.length} flights and ${hotels.length} hotels</p>
                </div>

                <div class="results-content">
                    <!-- Flights Section -->
                    <div class="service-section">
                        <h3 class="service-title">✈️ Flights</h3>
                        <div class="results-list">
                            ${flights.map(flight => this.renderFlightListItem(flight)).join('')}
                        </div>
                    </div>

                    <!-- Hotels Section -->
                    <div class="service-section">
                        <h3 class="service-title">🏨 Hotels</h3>
                        <div class="results-list">
                            ${hotels.map(hotel => this.renderHotelListItem(hotel)).join('')}
                        </div>
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
        this.container.innerHTML = `
            <div class="results-container">
                <div class="results-header">
                    <h2>Flight Search Results</h2>
                </div>
                
                <div class="results-summary">
                    <p>Found ${this.results.length} flights</p>
                </div>

                <div class="results-content">
                    <div class="results-list">
                        ${this.results.map(flight => this.renderFlightListItem(flight)).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderHotelResults() {
        this.container.innerHTML = `
            <div class="results-container">
                <div class="results-header">
                    <h2>Hotel Search Results</h2>
                </div>
                
                <div class="results-summary">
                    <p>Found ${this.results.length} hotels</p>
                </div>

                <div class="results-content">
                    <div class="results-list">
                        ${this.results.map(hotel => this.renderHotelListItem(hotel)).join('')}
                    </div>
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

    renderFlightListItem(flight) {
        return `
            <div class="result-list-item flight-list-item">
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
                <div class="list-item-actions">
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

    renderHotelListItem(hotel) {
        return `
            <div class="result-list-item hotel-list-item">
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
                        <div class="hotel-dates">
                            <span>Check-in: ${this.formatDate(hotel.checkIn)}</span>
                            <span>Check-out: ${this.formatDate(hotel.checkOut)}</span>
                        </div>
                    </div>
                    <div class="list-item-price">
                        <div class="price-amount">$${hotel.price}</div>
                        <div class="price-currency">${hotel.currency}/night</div>
                    </div>
                </div>
                <div class="list-item-actions">
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
