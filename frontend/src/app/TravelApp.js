import { SearchForm } from '../ui/SearchForm.js';
import { ResultsDisplay } from '../ui/ResultsDisplay.js';
import { StepByStepResults } from '../ui/StepByStepResults.js';
import { BackendClient } from '../api/BackendClient.js';
import { UrlManager } from '../utils/UrlManager.js';

/**
 * Main Travel Helper Application
 * Coordinates between UI components and backend service
 */
export class TravelApp {
    constructor() {
        this.backendClient = new BackendClient();
        this.searchForm = null;
        this.resultsDisplay = null;
        this.init();
    }

    init() {
        this.initializeUI();
        this.setupGlobalAccess();
        this.setupRouting();
        // Handle initial route after UI is ready
        setTimeout(() => {
            this.handleRouteChange();
        }, 100);
    }

    /**
     * Setup routing for /search path
     */
    setupRouting() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => {
            this.handleRouteChange();
        });
    }

    /**
     * Handle route changes
     */
    handleRouteChange() {
        if (UrlManager.isSearchPath()) {
            // On /search path - show loading or results
            const searchParams = UrlManager.parseSearchParamsFromUrl();
            if (searchParams) {
                // Show loading state immediately
                if (this.resultsDisplay) {
                    this.resultsDisplay.showLoading();
                }
                // Show results container
                this.showResults();
                // Populate form and perform search
                if (this.searchForm) {
                    this.populateFormFromParams(searchParams);
                }
                // Perform search automatically (skip URL update since we're already on /search)
                this.performSearchWithoutUrlUpdate('combined', searchParams);
            } else {
                // No params on /search - redirect to home
                window.history.pushState({}, '', '/');
                this.showSearchForm();
            }
        } else {
            // On home path - show search form
            this.showSearchForm();
        }
    }

    /**
     * Perform search without updating URL (used when already on /search path)
     */
    async performSearchWithoutUrlUpdate(service, searchParams) {
        console.log(`Starting ${service} search with params:`, searchParams);
        
        // Just update URL params without changing path
        const params = new URLSearchParams();
        if (searchParams.flights) {
            const { origin, destination, departureDate, returnDate, passengers } = searchParams.flights;
            if (origin) params.set('from', encodeURIComponent(origin));
            if (destination) params.set('to', encodeURIComponent(destination));
            if (departureDate) params.set('departure', departureDate);
            if (returnDate) params.set('return', returnDate);
            if (passengers) params.set('guests', passengers);
        }
        if (searchParams.hotels) {
            const { rooms } = searchParams.hotels;
            if (rooms) params.set('rooms', rooms);
        }
        const newUrl = `/search${params.toString() ? '?' + params.toString() : ''}`;
        window.history.replaceState({}, '', newUrl);
        
        // Ensure loading is shown
        this.resultsDisplay.showLoading();
        
        try {
            if (service === 'combined') {
                await this.performCombinedSearch(searchParams);
            } else {
                await this.performSingleSearch(service, searchParams);
            }
        } catch (error) {
            console.error('Search failed:', error);
            this.resultsDisplay.showError(error.message || 'An error occurred during search');
        }
    }

    /**
     * Check if URL has query parameters and perform search if found
     * (Used for initial load)
     */
    async checkUrlParams() {
        const searchParams = UrlManager.parseSearchParamsFromUrl();
        
        if (searchParams) {
            // Populate form with URL parameters
            if (this.searchForm) {
                this.populateFormFromParams(searchParams);
            }
            
            // Perform search automatically
            await this.performSearch('combined', searchParams);
        }
    }

    initializeUI() {
        // Initialize search form
        this.searchForm = new SearchForm('searchContainer', (service, params) => {
            return this.performSearch(service, params);
        });

        // Initialize results display
        this.resultsDisplay = new ResultsDisplay('resultsContainer', (service, params) => {
            return this.performSearch(service, params);
        });
        
        // Initialize step-by-step results (lazy initialization)
        this.stepResults = null;
        
        // Initial view will be determined by route
    }

    setupGlobalAccess() {
        // Make app globally accessible for UI callbacks
        window.travelApp = this;
    }

    async performSearch(service, searchParams) {
        console.log(`Starting ${service} search with params:`, searchParams);
        
        // Navigate to /search path if not already there
        const wasOnSearchPath = UrlManager.isSearchPath();
        if (!wasOnSearchPath) {
            // Update URL to /search path
            UrlManager.updateUrl(searchParams);
            // Show loading and results container when navigating to /search
            this.resultsDisplay.showLoading();
            this.showResults();
        } else {
            // Already on /search, just update params (don't trigger route change)
            const params = new URLSearchParams();
            if (searchParams.flights) {
                const { origin, destination, departureDate, returnDate, passengers } = searchParams.flights;
                if (origin) params.set('from', encodeURIComponent(origin));
                if (destination) params.set('to', encodeURIComponent(destination));
                if (departureDate) params.set('departure', departureDate);
                if (returnDate) params.set('return', returnDate);
                if (passengers) params.set('guests', passengers);
            }
            if (searchParams.hotels) {
                const { rooms } = searchParams.hotels;
                if (rooms) params.set('rooms', rooms);
            }
            const newUrl = `/search${params.toString() ? '?' + params.toString() : ''}`;
            window.history.replaceState({}, '', newUrl);
            // Ensure loading is shown
            this.resultsDisplay.showLoading();
        }
        
        try {
            if (service === 'combined') {
                await this.performCombinedSearch(searchParams);
            } else {
                await this.performSingleSearch(service, searchParams);
            }
        } catch (error) {
            console.error('Search failed:', error);
            this.resultsDisplay.showError(error.message || 'An error occurred during search');
        }
    }

    async performSingleSearch(service, searchParams) {
        console.log(`Performing ${service} search`);

        let results = [];

        try {
            if (service === 'flights') {
                results = await this.backendClient.searchFlights(searchParams);
            } else if (service === 'hotels') {
                results = await this.backendClient.searchHotels(searchParams);
            } else {
                throw new Error(`Unknown service type: ${service}`);
            }
        } catch (error) {
            console.error(`Error searching ${service}:`, error);
            throw error;
        }

        console.log(`Search completed. Found ${results.length} results`);
        
        // Display results
        this.resultsDisplay.displayResults(service, results);
        
        // Show results page
        this.showResults();
    }

    async performCombinedSearch(searchParams) {
        console.log('Performing combined search for flights and hotels');
        
        const { flights: flightParams, hotels: hotelParams } = searchParams;

        try {
            // Use combined search endpoint if available, otherwise search separately
            const combinedResults = await this.backendClient.searchCombined(searchParams);
            
            console.log(`Combined search completed. Found ${combinedResults.flights.length} flights and ${combinedResults.hotels.length} hotels`);
            
            // Initialize step-by-step results if not already created
            if (!this.stepResults) {
                this.stepResults = new StepByStepResults('resultsContainer', (service, params) => {
                    return this.performSearch(service, params);
                });
            }
            
            // Display step-by-step results
            this.stepResults.displayResults(combinedResults, searchParams);
            
            // Show results page
            this.showResults();
        } catch (error) {
            console.error('Error performing combined search:', error);
            throw error;
        }
    }

    showSearchForm() {
        document.getElementById('searchContainer').classList.remove('hidden');
        document.getElementById('resultsContainer').classList.add('hidden');
        document.querySelector('.app-container').classList.remove('showing-results');
    }

    showResults() {
        document.getElementById('searchContainer').classList.add('hidden');
        document.getElementById('resultsContainer').classList.remove('hidden');
        document.querySelector('.app-container').classList.add('showing-results');
    }

    /**
     * Populate search form with parameters
     * @param {Object} searchParams - Search parameters
     */
    populateFormFromParams(searchParams) {
        if (!this.searchForm || !this.searchForm.container) return;
        
        const { flights, hotels } = searchParams;
        
        if (flights) {
            const originField = this.searchForm.container.querySelector('#origin');
            const destinationField = this.searchForm.container.querySelector('#destination');
            const departureField = this.searchForm.container.querySelector('#departureDate');
            const returnField = this.searchForm.container.querySelector('#returnDate');
            const guestsField = this.searchForm.container.querySelector('#guests');
            
            if (originField && flights.origin) originField.value = flights.origin;
            if (destinationField && flights.destination) destinationField.value = flights.destination;
            if (departureField && flights.departureDate) departureField.value = flights.departureDate;
            if (returnField && flights.returnDate) returnField.value = flights.returnDate;
            if (guestsField && flights.passengers) guestsField.value = flights.passengers;
        }
        
        if (hotels) {
            const roomsField = this.searchForm.container.querySelector('#rooms');
            if (roomsField && hotels.rooms) roomsField.value = hotels.rooms;
        }
    }
}

