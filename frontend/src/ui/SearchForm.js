/**
 * Search form component for flights and hotels
 */
export class SearchForm {
    constructor(containerId, onSearch) {
        this.container = document.getElementById(containerId);
        this.onSearch = onSearch;
        this.cities = this.getCitiesList();
        this.init();
    }

    getCitiesList() {
        return [
            { value: 'Moscow', label: 'Moscow (MOW)' },
            { value: 'Saint Petersburg', label: 'Saint Petersburg (LED)' },
            { value: 'Samara', label: 'Samara (KUF)' },
            { value: 'Kazan', label: 'Kazan (KZN)' },
            { value: 'Novosibirsk', label: 'Novosibirsk (OVB)' },
            { value: 'Yekaterinburg', label: 'Yekaterinburg (SVX)' },
            { value: 'Sochi', label: 'Sochi (AER)' },
            { value: 'Krasnodar', label: 'Krasnodar (KRR)' },
            { value: 'Rostov-on-Don', label: 'Rostov-on-Don (ROV)' },
            { value: 'Volgograd', label: 'Volgograd (VOG)' },
            { value: 'Nizhny Novgorod', label: 'Nizhny Novgorod (GOJ)' },
            { value: 'Ufa', label: 'Ufa (UFA)' },
            { value: 'Perm', label: 'Perm (PEE)' },
            { value: 'Omsk', label: 'Omsk (OMS)' },
            { value: 'Krasnoyarsk', label: 'Krasnoyarsk (KJA)' },
            { value: 'Vladivostok', label: 'Vladivostok (VVO)' },
            { value: 'Irkutsk', label: 'Irkutsk (IKT)' },
            { value: 'Khabarovsk', label: 'Khabarovsk (KHV)' },
            { value: 'New York', label: 'New York (NYC)' },
            { value: 'Los Angeles', label: 'Los Angeles (LAX)' },
            { value: 'London', label: 'London (LON)' },
            { value: 'Paris', label: 'Paris (PAR)' },
            { value: 'Berlin', label: 'Berlin (BER)' },
            { value: 'Rome', label: 'Rome (ROM)' },
            { value: 'Madrid', label: 'Madrid (MAD)' },
            { value: 'Amsterdam', label: 'Amsterdam (AMS)' },
            { value: 'Dubai', label: 'Dubai (DXB)' },
            { value: 'Istanbul', label: 'Istanbul (IST)' },
            { value: 'Bangkok', label: 'Bangkok (BKK)' },
            { value: 'Tokyo', label: 'Tokyo (TYO)' },
            { value: 'Singapore', label: 'Singapore (SIN)' },
            { value: 'Sydney', label: 'Sydney (SYD)' }
        ];
    }

    init() {
        this.render();
        this.attachEventListeners();
        this.populateFromUrl();
    }

    /**
     * Populate form from URL parameters if available
     */
    populateFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const from = urlParams.get('from');
        const to = urlParams.get('to');
        const departure = urlParams.get('departure');
        const returnDate = urlParams.get('return');
        const guests = urlParams.get('guests');
        const rooms = urlParams.get('rooms');
        
        if (from) {
            const originField = this.container.querySelector('#origin');
            if (originField) originField.value = decodeURIComponent(from);
        }
        
        if (to) {
            const destinationField = this.container.querySelector('#destination');
            if (destinationField) destinationField.value = decodeURIComponent(to);
        }
        
        if (departure) {
            const departureField = this.container.querySelector('#departureDate');
            if (departureField) departureField.value = departure;
        }
        
        if (returnDate) {
            const returnField = this.container.querySelector('#returnDate');
            if (returnField) returnField.value = returnDate;
        }
        
        if (guests) {
            const guestsField = this.container.querySelector('#guests');
            if (guestsField) guestsField.value = guests;
        }
        
        if (rooms) {
            const roomsField = this.container.querySelector('#rooms');
            if (roomsField) roomsField.value = rooms;
        }
    }

    render() {
        console.log('Rendering simplified search form (no tabs)');
        this.container.innerHTML = `
            <div class="search-container">
                <div class="search-header">
                    <h1>Travel Helper</h1>
                    <p>Find the best flights and hotels from multiple sources</p>
                </div>

                <form class="search-form" id="searchForm">
                    <div class="form-section">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="origin">From</label>
                                <select id="origin" required>
                                    <option value="">Select city</option>
                                    ${this.cities.map(city => `<option value="${city.value}">${city.label}</option>`).join('')}
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="destination">To</label>
                                <select id="destination" required>
                                    <option value="">Select city</option>
                                    ${this.cities.map(city => `<option value="${city.value}">${city.label}</option>`).join('')}
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="departureDate">Departure</label>
                                <input type="date" id="departureDate" required>
                            </div>
                            <div class="form-group">
                                <label for="returnDate">Return (Optional)</label>
                                <input type="date" id="returnDate">
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="guests">Travelers</label>
                                <select id="guests">
                                    <option value="1">1 Traveler</option>
                                    <option value="2" selected>2 Travelers</option>
                                    <option value="3">3 Travelers</option>
                                    <option value="4">4 Travelers</option>
                                    <option value="5">5 Travelers</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="rooms">Rooms</label>
                                <select id="rooms">
                                    <option value="1" selected>1 Room</option>
                                    <option value="2">2 Rooms</option>
                                    <option value="3">3 Rooms</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="search-button">
                            <span class="button-text">Search</span>
                            <span class="loading-spinner hidden"></span>
                        </button>
                    </div>
                </form>
            </div>
        `;
    }

    attachEventListeners() {
        // Form submission
        const form = this.container.querySelector('#searchForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Set default dates
        this.setDefaultDates();
    }


    setDefaultDates() {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);

        const departureDate = this.container.querySelector('#departureDate');
        const returnDate = this.container.querySelector('#returnDate');

        if (departureDate) departureDate.value = tomorrow.toISOString().split('T')[0];
        if (returnDate) returnDate.value = nextWeek.toISOString().split('T')[0];
    }

    handleSubmit() {
        const searchButton = this.container.querySelector('.search-button');
        const buttonText = this.container.querySelector('.button-text');
        const loadingSpinner = this.container.querySelector('.loading-spinner');

        // Get search parameters first
        const searchParams = this.getSearchParams();

        // Update URL immediately with search parameters - navigate to /search
        this.updateUrlFromParams(searchParams);

        // Show loading state
        searchButton.disabled = true;
        buttonText.classList.add('hidden');
        loadingSpinner.classList.remove('hidden');

        // Call the search callback - always search for both flights and hotels
        this.onSearch('combined', searchParams)
            .finally(() => {
                // Reset button state
                searchButton.disabled = false;
                buttonText.classList.remove('hidden');
                loadingSpinner.classList.add('hidden');
            });
    }

    /**
     * Update URL with search parameters
     * @param {Object} searchParams - Search parameters
     */
    updateUrlFromParams(searchParams) {
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
        
        // Navigate to /search path with parameters
        const basePath = '/search';
        const newUrl = `${basePath}${params.toString() ? '?' + params.toString() : ''}`;
        window.history.pushState({}, '', newUrl);
    }

    getSearchParams() {
        const origin = this.container.querySelector('#origin').value;
        const destination = this.container.querySelector('#destination').value;
        const departureDate = this.container.querySelector('#departureDate').value;
        const returnDate = this.container.querySelector('#returnDate').value || null;
        const guests = parseInt(this.container.querySelector('#guests').value);
        const rooms = parseInt(this.container.querySelector('#rooms').value);

        return {
            flights: {
                origin: origin,
                destination: destination,
                departureDate: departureDate,
                returnDate: returnDate,
                passengers: guests
            },
            hotels: {
                destination: destination,
                checkIn: departureDate,
                checkOut: returnDate || this.getDefaultCheckOut(departureDate),
                guests: guests,
                rooms: rooms
            }
        };
    }

    getDefaultCheckOut(checkInDate) {
        if (!checkInDate) return null;
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkIn);
        checkOut.setDate(checkOut.getDate() + 3); // Default 3 nights
        return checkOut.toISOString().split('T')[0];
    }
}
