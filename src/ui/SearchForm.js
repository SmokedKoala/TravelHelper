/**
 * Search form component for flights and hotels
 */
export class SearchForm {
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
                                <input type="text" id="origin" placeholder="City or Airport" required>
                            </div>
                            <div class="form-group">
                                <label for="destination">To</label>
                                <input type="text" id="destination" placeholder="City or Airport" required>
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

        // Show loading state
        searchButton.disabled = true;
        buttonText.classList.add('hidden');
        loadingSpinner.classList.remove('hidden');

        // Get search parameters
        const searchParams = this.getSearchParams();

        // Call the search callback - always search for both flights and hotels
        this.onSearch('combined', searchParams)
            .finally(() => {
                // Reset button state
                searchButton.disabled = false;
                buttonText.classList.remove('hidden');
                loadingSpinner.classList.add('hidden');
            });
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
