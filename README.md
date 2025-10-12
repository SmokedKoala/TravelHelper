# Travel Helper

A modern web application for finding flights and hotels from multiple travel websites including Booking.com, Aviasales, and Ostrovok.

## Features

- **Multi-source Search**: Search across multiple travel websites simultaneously
- **Clean Architecture**: Modular scraper system for easy addition of new sources
- **Modern UI**: Beautiful, responsive interface with smooth animations
- **Real-time Results**: Parallel searching for fast results
- **No Backend Required**: Pure JavaScript frontend application

## Architecture

The application follows a clean architecture pattern with separate concerns:

- **Scrapers** (`src/scrapers/`): Individual scrapers for each travel website
- **UI Components** (`src/ui/`): Reusable UI components for search and results
- **Application Logic** (`src/app/`): Main application coordination
- **Common Interface**: All scrapers implement the same interface for consistency

## Project Structure

```
TravelHelper/
├── src/
│   ├── scrapers/
│   │   ├── ScraperInterface.js    # Common interface for all scrapers
│   │   ├── BookingScraper.js      # Booking.com scraper
│   │   ├── AviasalesScraper.js    # Aviasales.ru scraper
│   │   └── OstrovokScraper.js     # Ostrovok.ru scraper
│   ├── ui/
│   │   ├── SearchForm.js          # Search form component
│   │   └── ResultsDisplay.js      # Results display component
│   └── app/
│       └── TravelApp.js           # Main application logic
├── styles/
│   └── main.css                   # Application styles
├── index.html                     # Entry point
├── package.json                   # Project configuration
└── README.md                      # This file
```

## Getting Started

### Prerequisites

- Node.js (for running a local server)
- Modern web browser with ES6 module support

### Installation

1. Clone or download the project
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

1. Start the development server:
   ```bash
   npm start
   ```
   
   Or for development with CORS enabled:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`

## Usage

1. **Search for Flights**:
   - Enter origin and destination cities/airports
   - Select departure and return dates
   - Choose number of passengers
   - Click "Search" to find flights from all sources

2. **Search for Hotels**:
   - Switch to the "Hotels" tab
   - Enter destination city
   - Select check-in and check-out dates
   - Choose number of guests and rooms
   - Click "Search" to find hotels from all sources

3. **View Results**:
   - Results are grouped by source website
   - Each result shows key information and pricing
   - Click "Book" buttons to visit the original website

## Adding New Scrapers

To add a new travel website scraper:

1. Create a new file in `src/scrapers/` (e.g., `NewSiteScraper.js`)
2. Extend the `ScraperInterface` class
3. Implement the required methods:
   - `searchFlights(searchParams)`
   - `searchHotels(searchParams)`
   - `getSupportedServices()`
   - `validateParams(searchParams, serviceType)`
4. Add the new scraper to the `TravelApp.js` initialization

Example:
```javascript
import { ScraperInterface } from './ScraperInterface.js';

export class NewSiteScraper extends ScraperInterface {
    constructor() {
        super('New Site', 'https://newsite.com');
    }
    
    async searchFlights(searchParams) {
        // Implementation here
    }
    
    // ... other required methods
}
```

## Current Limitations

- **Mock Data**: Currently uses mock data for demonstration
- **CORS Issues**: Real scraping would require backend proxy or CORS-enabled APIs
- **No Filters**: Advanced filtering will be added in future versions
- **No Persistence**: Search history is not saved

## Future Enhancements

- [ ] Real API integrations or backend proxy
- [ ] Advanced filtering options
- [ ] Price comparison charts
- [ ] Search history and favorites
- [ ] User accounts and preferences
- [ ] Mobile app version
- [ ] More travel websites integration

## Technical Notes

- Built with vanilla JavaScript (ES6 modules)
- No external frameworks or libraries
- Responsive design with CSS Grid and Flexbox
- Modern browser features (ES6+, CSS Grid, etc.)

## License

MIT License - feel free to use and modify as needed.
