/**
 * Compact header form for results page
 */
export class HeaderForm {
    constructor(containerId, onSearch) {
        this.container = document.getElementById(containerId);
        this.onSearch = onSearch;
        this.init();
    }

    init() {
        this.render();
        this.attachEventListeners();
    }

    render() {
        this.container.innerHTML = `
            <div class="header-form-container">
                <form class="header-form" id="headerSearchForm">
                    <div class="header-form-row">
                        <div class="header-form-group">
                            <label for="headerOrigin">From</label>
                            <input type="text" id="headerOrigin" placeholder="City or Airport" required>
                        </div>
                        <div class="header-form-group">
                            <label for="headerDestination">To</label>
                            <input type="text" id="headerDestination" placeholder="City or Airport" required>
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

        // Show loading state
        searchButton.disabled = true;
        buttonText.classList.add('hidden');
        loadingSpinner.classList.remove('hidden');

        // Get search parameters
        const searchParams = this.getSearchParams();

        // Call the search callback
        this.onSearch('combined', searchParams)
            .finally(() => {
                // Reset button state
                searchButton.disabled = false;
                buttonText.classList.remove('hidden');
                loadingSpinner.classList.add('hidden');
            });
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
