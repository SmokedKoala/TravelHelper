/**
 * Common interface for all travel scrapers
 * This ensures consistent behavior across all scrapers
 */
export class ScraperInterface {
    constructor(name, baseUrl) {
        this.name = name;
        this.baseUrl = baseUrl;
    }

    /**
     * Search for flights
     * @param {Object} searchParams - Search parameters
     * @param {string} searchParams.origin - Origin airport/city
     * @param {string} searchParams.destination - Destination airport/city
     * @param {string} searchParams.departureDate - Departure date (YYYY-MM-DD)
     * @param {string} searchParams.returnDate - Return date (YYYY-MM-DD, optional)
     * @param {number} searchParams.passengers - Number of passengers
     * @returns {Promise<Array>} Array of flight results
     */
    async searchFlights(searchParams) {
        throw new Error(`${this.name} scraper must implement searchFlights method`);
    }

    /**
     * Search for hotels
     * @param {Object} searchParams - Search parameters
     * @param {string} searchParams.destination - Destination city
     * @param {string} searchParams.checkIn - Check-in date (YYYY-MM-DD)
     * @param {string} searchParams.checkOut - Check-out date (YYYY-MM-DD)
     * @param {number} searchParams.guests - Number of guests
     * @param {number} searchParams.rooms - Number of rooms
     * @returns {Promise<Array>} Array of hotel results
     */
    async searchHotels(searchParams) {
        throw new Error(`${this.name} scraper must implement searchHotels method`);
    }

    /**
     * Get scraper information
     * @returns {Object} Scraper metadata
     */
    getInfo() {
        return {
            name: this.name,
            baseUrl: this.baseUrl,
            supportedServices: this.getSupportedServices()
        };
    }

    /**
     * Get list of supported services (flights, hotels, etc.)
     * @returns {Array<string>} Array of supported service types
     */
    getSupportedServices() {
        throw new Error(`${this.name} scraper must implement getSupportedServices method`);
    }

    /**
     * Validate search parameters
     * @param {Object} searchParams - Parameters to validate
     * @param {string} serviceType - Type of service (flights/hotels)
     * @returns {boolean} True if parameters are valid
     */
    validateParams(searchParams, serviceType) {
        throw new Error(`${this.name} scraper must implement validateParams method`);
    }
}
