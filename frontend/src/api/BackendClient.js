/**
 * Backend Client for Travel Helper
 * Makes HTTP requests to backend service
 * Currently uses mocked responses until backend is implemented
 */
export class BackendClient {
    constructor(baseUrl = 'http://localhost:3001/api') {
        this.baseUrl = baseUrl;
        this.useMock = true; // Set to false when backend is ready
    }

    /**
     * Search for flights
     * @param {Object} searchParams - Flight search parameters
     * @returns {Promise<Array>} Array of flight results
     */
    async searchFlights(searchParams) {
        if (this.useMock) {
            return this.mockSearchFlights(searchParams);
        }

        try {
            const response = await fetch(`${this.baseUrl}/flights/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(searchParams)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.flights || [];
        } catch (error) {
            console.error('Error searching flights:', error);
            throw error;
        }
    }

    /**
     * Search for hotels
     * @param {Object} searchParams - Hotel search parameters
     * @returns {Promise<Array>} Array of hotel results
     */
    async searchHotels(searchParams) {
        if (this.useMock) {
            return this.mockSearchHotels(searchParams);
        }

        try {
            const response = await fetch(`${this.baseUrl}/hotels/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(searchParams)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.hotels || [];
        } catch (error) {
            console.error('Error searching hotels:', error);
            throw error;
        }
    }

    /**
     * Combined search for flights and hotels
     * @param {Object} searchParams - Combined search parameters with flights and hotels
     * @returns {Promise<Object>} Object with flights and hotels arrays
     */
    async searchCombined(searchParams) {
        if (this.useMock) {
            return this.mockSearchCombined(searchParams);
        }

        try {
            const response = await fetch(`${this.baseUrl}/search/combined`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(searchParams)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error performing combined search:', error);
            throw error;
        }
    }

    /**
     * Mock flight search - combines data from multiple sources
     */
    async mockSearchFlights(searchParams) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const flights = [
            // Aviasales results
            {
                id: 'aviasales_flight_1',
                airline: 'Aeroflot',
                origin: searchParams.origin,
                destination: searchParams.destination,
                departureTime: '06:45',
                arrivalTime: '11:20',
                price: 189,
                currency: 'USD',
                duration: '4h 35m',
                stops: 0,
                source: 'Aviasales',
                bookingUrl: 'https://www.aviasales.ru/search'
            },
            {
                id: 'aviasales_flight_2',
                airline: 'S7 Airlines',
                origin: searchParams.origin,
                destination: searchParams.destination,
                departureTime: '16:10',
                arrivalTime: '22:30',
                price: 165,
                currency: 'USD',
                duration: '6h 20m',
                stops: 1,
                source: 'Aviasales',
                bookingUrl: 'https://www.aviasales.ru/search'
            },
            {
                id: 'aviasales_flight_3',
                airline: 'Lufthansa',
                origin: searchParams.origin,
                destination: searchParams.destination,
                departureTime: '10:15',
                arrivalTime: '15:45',
                price: 220,
                currency: 'USD',
                duration: '5h 30m',
                stops: 0,
                source: 'Aviasales',
                bookingUrl: 'https://www.aviasales.ru/search'
            },
            // Booking.com results
            {
                id: 'booking_flight_1',
                airline: 'Airline A',
                origin: searchParams.origin,
                destination: searchParams.destination,
                departureTime: '08:30',
                arrivalTime: '12:45',
                price: 299,
                currency: 'USD',
                duration: '4h 15m',
                stops: 0,
                source: 'Booking.com',
                bookingUrl: 'https://www.booking.com/flights/search'
            },
            {
                id: 'booking_flight_2',
                airline: 'Airline B',
                origin: searchParams.origin,
                destination: searchParams.destination,
                departureTime: '14:20',
                arrivalTime: '19:10',
                price: 245,
                currency: 'USD',
                duration: '4h 50m',
                stops: 1,
                source: 'Booking.com',
                bookingUrl: 'https://www.booking.com/flights/search'
            },
            // Ostrovok results
            {
                id: 'ostrovok_flight_1',
                airline: 'Turkish Airlines',
                origin: searchParams.origin,
                destination: searchParams.destination,
                departureTime: '09:00',
                arrivalTime: '13:30',
                price: 195,
                currency: 'USD',
                duration: '4h 30m',
                stops: 0,
                source: 'Ostrovok',
                bookingUrl: 'https://www.ostrovok.ru/flights'
            }
        ];

        // Add return flights if return date is specified
        if (searchParams.returnDate) {
            flights.push(
                {
                    id: 'aviasales_return_1',
                    airline: 'Aeroflot',
                    origin: searchParams.destination,
                    destination: searchParams.origin,
                    departureTime: '18:45',
                    arrivalTime: '23:20',
                    price: 179,
                    currency: 'USD',
                    duration: '4h 35m',
                    stops: 0,
                    returnDate: searchParams.returnDate,
                    source: 'Aviasales',
                    bookingUrl: 'https://www.aviasales.ru/search'
                },
                {
                    id: 'aviasales_return_2',
                    airline: 'S7 Airlines',
                    origin: searchParams.destination,
                    destination: searchParams.origin,
                    departureTime: '12:10',
                    arrivalTime: '18:30',
                    price: 155,
                    currency: 'USD',
                    duration: '6h 20m',
                    stops: 1,
                    returnDate: searchParams.returnDate,
                    source: 'Aviasales',
                    bookingUrl: 'https://www.aviasales.ru/search'
                },
                {
                    id: 'booking_return_1',
                    airline: 'Airline A',
                    origin: searchParams.destination,
                    destination: searchParams.origin,
                    departureTime: '16:30',
                    arrivalTime: '20:45',
                    price: 289,
                    currency: 'USD',
                    duration: '4h 15m',
                    stops: 0,
                    returnDate: searchParams.returnDate,
                    source: 'Booking.com',
                    bookingUrl: 'https://www.booking.com/flights/search'
                },
                {
                    id: 'booking_return_2',
                    airline: 'Airline B',
                    origin: searchParams.destination,
                    destination: searchParams.origin,
                    departureTime: '10:15',
                    arrivalTime: '15:05',
                    price: 235,
                    currency: 'USD',
                    duration: '4h 50m',
                    stops: 1,
                    returnDate: searchParams.returnDate,
                    source: 'Booking.com',
                    bookingUrl: 'https://www.booking.com/flights/search'
                }
            );
        }

        return flights;
    }

    /**
     * Mock hotel search - combines data from multiple sources
     */
    async mockSearchHotels(searchParams) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        return [
            // Booking.com results
            {
                id: 'booking_hotel_1',
                name: 'Grand Hotel Central',
                location: searchParams.destination,
                price: 120,
                currency: 'USD',
                rating: 4.5,
                amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant', 'Spa'],
                checkIn: searchParams.checkIn,
                checkOut: searchParams.checkOut,
                source: 'Booking.com',
                bookingUrl: 'https://www.booking.com/hotels/search'
            },
            {
                id: 'booking_hotel_2',
                name: 'Budget Inn Downtown',
                location: searchParams.destination,
                price: 65,
                currency: 'USD',
                rating: 3.8,
                amenities: ['WiFi', 'Parking'],
                checkIn: searchParams.checkIn,
                checkOut: searchParams.checkOut,
                source: 'Booking.com',
                bookingUrl: 'https://www.booking.com/hotels/search'
            },
            // Ostrovok results
            {
                id: 'ostrovok_hotel_1',
                name: 'Luxury Resort & Spa',
                location: searchParams.destination,
                price: 180,
                currency: 'USD',
                rating: 4.8,
                amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant', 'Spa', 'Beach Access'],
                checkIn: searchParams.checkIn,
                checkOut: searchParams.checkOut,
                source: 'Ostrovok',
                bookingUrl: 'https://www.ostrovok.ru/hotels'
            },
            {
                id: 'ostrovok_hotel_2',
                name: 'City Center Hotel',
                location: searchParams.destination,
                price: 95,
                currency: 'USD',
                rating: 4.2,
                amenities: ['WiFi', 'Restaurant', 'Business Center'],
                checkIn: searchParams.checkIn,
                checkOut: searchParams.checkOut,
                source: 'Ostrovok',
                bookingUrl: 'https://www.ostrovok.ru/hotels'
            },
            {
                id: 'ostrovok_hotel_3',
                name: 'Cozy Boutique Hotel',
                location: searchParams.destination,
                price: 75,
                currency: 'USD',
                rating: 4.0,
                amenities: ['WiFi', 'Breakfast'],
                checkIn: searchParams.checkIn,
                checkOut: searchParams.checkOut,
                source: 'Ostrovok',
                bookingUrl: 'https://www.ostrovok.ru/hotels'
            }
        ];
    }

    /**
     * Mock combined search
     */
    async mockSearchCombined(searchParams) {
        const { flights: flightParams, hotels: hotelParams } = searchParams;

        const [flights, hotels] = await Promise.all([
            this.mockSearchFlights(flightParams),
            this.mockSearchHotels(hotelParams)
        ]);

        return {
            flights,
            hotels
        };
    }

    /**
     * Enable/disable mock mode
     * @param {boolean} useMock - Whether to use mock responses
     */
    setMockMode(useMock) {
        this.useMock = useMock;
    }
}

