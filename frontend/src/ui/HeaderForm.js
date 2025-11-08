/**
 * Compact header form for results page
 */
export class HeaderForm {
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
            const originField = this.container.querySelector('#headerOrigin');
            if (originField) originField.value = decodeURIComponent(from);
        }
        
        if (to) {
            const destinationField = this.container.querySelector('#headerDestination');
            if (destinationField) destinationField.value = decodeURIComponent(to);
        }
        
        if (departure) {
            const departureField = this.container.querySelector('#headerDepartureDate');
            if (departureField) departureField.value = departure;
        }
        
        if (returnDate) {
            const returnField = this.container.querySelector('#headerReturnDate');
            if (returnField) returnField.value = returnDate;
        }
        
        if (guests) {
            const guestsField = this.container.querySelector('#headerGuests');
            if (guestsField) guestsField.value = guests;
        }
        
        if (rooms) {
            const roomsField = this.container.querySelector('#headerRooms');
            if (roomsField) roomsField.value = rooms;
        }
    }

    render() {
        this.container.innerHTML = `
            <div class="header-form-container">
                <form class="header-form" id="headerSearchForm">
                    <div class="header-form-row">
                        <div class="header-form-group">
                            <label for="headerOrigin">From</label>
                            <select id="headerOrigin" required>
                                <option value="">Select city</option>
                                ${this.cities.map(city => `<option value="${city.value}">${city.label}</option>`).join('')}
                            </select>
                        </div>
                        <div class="header-form-group">
                            <label for="headerDestination">To</label>
                            <select id="headerDestination" required>
                                <option value="">Select city</option>
                                ${this.cities.map(city => `<option value="${city.value}">${city.label}</option>`).join('')}
                            </select>
                        </div>
                        <div class="header-form-group">
                            <label for="headerDepartureDate">Departure</label>
                            <input type="date" id="headerDepartureDate" required>
                        </div>
                        <div class="header-form-group">
                            <label for="headerReturnDate">Return</label>
                            <input type="date" id="headerReturnDate">
                        </div>
                        <div class="header-form-group">
                            <label for="headerGuests">Travelers</label>
                            <select id="headerGuests">
                                <option value="1">1</option>
                                <option value="2" selected>2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                        </div>
                        <div class="header-form-group">
                            <label for="headerRooms">Rooms</label>
                            <select id="headerRooms">
                                <option value="1" selected>1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                            </select>
                        </div>
                        <div class="header-form-group">
                            <button type="submit" class="header-search-button">
                                <span class="button-text">Search</span>
                                <span class="loading-spinner hidden"></span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        `;
    }

    attachEventListeners() {
        const form = this.container.querySelector('#headerSearchForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    handleSubmit() {
        const searchButton = this.container.querySelector('.header-search-button');
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

        // Call the search callback
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
        const origin = this.container.querySelector('#headerOrigin').value;
        const destination = this.container.querySelector('#headerDestination').value;
        const departureDate = this.container.querySelector('#headerDepartureDate').value;
        const returnDate = this.container.querySelector('#headerReturnDate').value || null;
        const guests = parseInt(this.container.querySelector('#headerGuests').value);
        const rooms = parseInt(this.container.querySelector('#headerRooms').value);

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

    populateForm(searchParams) {
        // Populate form with current search parameters
        if (searchParams.flights) {
            const originField = this.container.querySelector('#headerOrigin');
            const destinationField = this.container.querySelector('#headerDestination');
            const departureField = this.container.querySelector('#headerDepartureDate');
            const returnField = this.container.querySelector('#headerReturnDate');
            const guestsField = this.container.querySelector('#headerGuests');
            
            if (originField) originField.value = searchParams.flights.origin || '';
            if (destinationField) destinationField.value = searchParams.flights.destination || '';
            if (departureField) departureField.value = searchParams.flights.departureDate || '';
            if (returnField) returnField.value = searchParams.flights.returnDate || '';
            if (guestsField) guestsField.value = searchParams.flights.passengers || 2;
        }
        
        if (searchParams.hotels) {
            const roomsField = this.container.querySelector('#headerRooms');
            if (roomsField) roomsField.value = searchParams.hotels.rooms || 1;
        }
    }
}
