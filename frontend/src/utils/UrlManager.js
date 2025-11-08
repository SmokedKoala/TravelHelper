/**
 * URL Manager for handling query parameters
 */
export class UrlManager {
    /**
     * Get all query parameters from URL
     * @returns {Object} Object with query parameters
     */
    static getQueryParams() {
        const params = new URLSearchParams(window.location.search);
        const result = {};
        
        for (const [key, value] of params.entries()) {
            result[key] = decodeURIComponent(value);
        }
        
        return result;
    }

    /**
     * Get a specific query parameter
     * @param {string} key - Parameter name
     * @param {string} defaultValue - Default value if not found
     * @returns {string} Parameter value or default
     */
    static getQueryParam(key, defaultValue = null) {
        const params = new URLSearchParams(window.location.search);
        return params.get(key) ? decodeURIComponent(params.get(key)) : defaultValue;
    }

    /**
     * Update URL with search parameters
     * @param {Object} searchParams - Search parameters object
     */
    static updateUrl(searchParams) {
        const params = new URLSearchParams();
        
        // Extract flight parameters
        if (searchParams.flights) {
            const { origin, destination, departureDate, returnDate, passengers } = searchParams.flights;
            if (origin) params.set('from', encodeURIComponent(origin));
            if (destination) params.set('to', encodeURIComponent(destination));
            if (departureDate) params.set('departure', departureDate);
            if (returnDate) params.set('return', returnDate);
            if (passengers) params.set('guests', passengers);
        }
        
        // Extract hotel parameters
        if (searchParams.hotels) {
            const { rooms } = searchParams.hotels;
            if (rooms) params.set('rooms', rooms);
        }
        
        // Update URL to /search path without page reload
        const basePath = window.location.pathname.endsWith('/search') 
            ? window.location.pathname 
            : '/search';
        const newUrl = `${basePath}${params.toString() ? '?' + params.toString() : ''}`;
        window.history.pushState({}, '', newUrl);
    }

    /**
     * Check if current path is /search
     * @returns {boolean}
     */
    static isSearchPath() {
        return window.location.pathname.endsWith('/search') || window.location.pathname === '/search';
    }

    /**
     * Parse query parameters into search parameters format
     * @returns {Object|null} Search parameters object or null if insufficient params
     */
    static parseSearchParamsFromUrl() {
        const from = this.getQueryParam('from');
        const to = this.getQueryParam('to');
        const departure = this.getQueryParam('departure');
        const returnDate = this.getQueryParam('return');
        const guests = this.getQueryParam('guests', '2');
        const rooms = this.getQueryParam('rooms', '1');
        
        // Check if we have minimum required parameters
        if (!from || !to || !departure) {
            return null;
        }
        
        return {
            flights: {
                origin: from,
                destination: to,
                departureDate: departure,
                returnDate: returnDate || null,
                passengers: parseInt(guests) || 2
            },
            hotels: {
                destination: to,
                checkIn: departure,
                checkOut: returnDate || this.getDefaultCheckOut(departure),
                guests: parseInt(guests) || 2,
                rooms: parseInt(rooms) || 1
            }
        };
    }

    /**
     * Get default check-out date (3 nights after check-in)
     * @param {string} checkInDate - Check-in date string
     * @returns {string} Check-out date string
     */
    static getDefaultCheckOut(checkInDate) {
        if (!checkInDate) return null;
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkIn);
        checkOut.setDate(checkOut.getDate() + 3); // Default 3 nights
        return checkOut.toISOString().split('T')[0];
    }

    /**
     * Clear all query parameters
     */
    static clearUrl() {
        window.history.pushState({}, '', window.location.pathname);
    }
}

