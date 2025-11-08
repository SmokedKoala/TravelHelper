# Travel Helper

Web application for finding flights and hotels from multiple sources.

## Project Structure

```
TravelHelper/
├── frontend/          # Frontend application
│   ├── src/
│   │   ├── app/       # Main application logic
│   │   ├── ui/        # UI components
│   │   └── api/       # Backend client
│   ├── styles/        # CSS styles
│   └── index.html     # Entry point
├── backend/           # Backend service (to be implemented)
└── package.json       # Project configuration
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Running the Application

```bash
npm start
```

The application will be available at `http://localhost:3000`

### Development Mode

```bash
npm run dev
```

## Architecture

### Frontend

The frontend is a vanilla JavaScript application that communicates with a backend service via HTTP API.

- **BackendClient**: Handles all API communication with the backend service
- **TravelApp**: Main application coordinator
- **UI Components**: SearchForm, ResultsDisplay, StepByStepResults, HeaderForm

### Backend (Planned)

The backend service will provide REST API endpoints for:
- Flight search
- Hotel search
- Combined search

Currently, the frontend uses mocked responses from the BackendClient. To switch to real backend:

1. Implement the backend service in the `backend/` folder
2. Set `useMock = false` in `BackendClient.js` or configure the backend URL

## Features

- Search for flights and hotels
- Combined search for travel packages
- Step-by-step selection process
- List view for results
- Multiple source aggregation

## License

MIT
