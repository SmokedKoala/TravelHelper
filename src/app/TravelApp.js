import { SearchForm } from '../ui/SearchForm.js';
import { ResultsDisplay } from '../ui/ResultsDisplay.js';
import { StepByStepResults } from '../ui/StepByStepResults.js';
import { BookingScraper } from '../scrapers/BookingScraper.js';
import { AviasalesScraper } from '../scrapers/AviasalesScraper.js';
import { OstrovokScraper } from '../scrapers/OstrovokScraper.js';
import { ScraperInterface } from '../scrapers/ScraperInterface.js';

/**
 * Main Travel Helper Application
 * Coordinates between UI components and scrapers
 */
export class TravelApp {
    constructor() {
        this.scrapers = [];
        this.searchForm = null;
        this.resultsDisplay = null;
        this.init();
    }

    init() {
        this.initializeScrapers();
        this.initializeUI();
        this.setupGlobalAccess();
    }

    initializeScrapers() {
        // Initialize all available scrapers
        this.scrapers = [
            new BookingScraper(),
            new AviasalesScraper(),
            new OstrovokScraper()
        ];

        console.log('Initialized scrapers:', this.scrapers.map(s => s.getInfo()));
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
        
        // Show search form by default
        this.showSearchForm();
    }

    setupGlobalAccess() {
        // Make app globally accessible for UI callbacks
        window.travelApp = this;
    }

    async performSearch(service, searchParams) {
        console.log(`Starting ${service} search with params:`, searchParams);
        
        // Show loading state
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

    async performSingleSearch(service, searchParams) {
        // Get scrapers that support the requested service
        const relevantScrapers = this.scrapers.filter(scraper => 
            scraper.getSupportedServices().includes(service)
        );

        if (relevantScrapers.length === 0) {
            throw new Error(`No scrapers available for ${service} search`);
        }

        console.log(`Using ${relevantScrapers.length} scrapers for ${service} search`);

        // Execute searches in parallel
        const searchPromises = relevantScrapers.map(async (scraper) => {
            try {
                if (service === 'flights') {
                    return await scraper.searchFlights(searchParams);
                } else if (service === 'hotels') {
                    return await scraper.searchHotels(searchParams);
                }
            } catch (error) {
                console.error(`Error searching ${scraper.name}:`, error);
                return []; // Return empty array for failed searches
            }
        });

        // Wait for all searches to complete
        const results = await Promise.all(searchPromises);
        
        // Flatten and combine results
        const allResults = results.flat();
        
        console.log(`Search completed. Found ${allResults.length} results`);
        
        // Display results
        this.resultsDisplay.displayResults(service, allResults);
        
        // Show results page
        this.showResults();
    }

    async performCombinedSearch(searchParams) {
        console.log('Performing combined search for flights and hotels');
        
        const { flights: flightParams, hotels: hotelParams } = searchParams;
        
        // Get scrapers that support both services
        const relevantScrapers = this.scrapers.filter(scraper => 
            scraper.getSupportedServices().includes('flights') && 
            scraper.getSupportedServices().includes('hotels')
        );

        if (relevantScrapers.length === 0) {
            throw new Error('No scrapers available for combined search');
        }

        console.log(`Using ${relevantScrapers.length} scrapers for combined search`);

        // Execute both flight and hotel searches in parallel for each scraper
        const searchPromises = relevantScrapers.map(async (scraper) => {
            try {
                const [flightResults, hotelResults] = await Promise.all([
                    scraper.searchFlights(flightParams),
                    scraper.searchHotels(hotelParams)
                ]);
                
                return {
                    flights: flightResults,
                    hotels: hotelResults
                };
            } catch (error) {
                console.error(`Error searching ${scraper.name}:`, error);
                return {
                    flights: [],
                    hotels: []
                };
            }
        });

        // Wait for all searches to complete
        const allResults = await Promise.all(searchPromises);
        
        // Combine results from all scrapers
        const combinedResults = {
            flights: [],
            hotels: []
        };
        
        allResults.forEach(result => {
            combinedResults.flights.push(...result.flights);
            combinedResults.hotels.push(...result.hotels);
        });
        
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

    // Utility method to get scraper information
    getScraperInfo() {
        return this.scrapers.map(scraper => scraper.getInfo());
    }

    // Method to add new scrapers dynamically
    addScraper(scraper) {
        if (scraper instanceof ScraperInterface) {
            this.scrapers.push(scraper);
            console.log(`Added new scraper: ${scraper.name}`);
        } else {
            throw new Error('Scraper must implement ScraperInterface');
        }
    }
}
