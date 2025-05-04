# Countries Explorer

A React application that allows users to explore information about countries around the world using the REST Countries API.

## Features

- View basic information about all countries
- Search for countries by name
- Filter countries by region
- View detailed information about a specific country
- User session management
- Responsive design for mobile and desktop

## Technologies Used

- React (with functional components and hooks)
- React Router for navigation
- Tailwind CSS for styling
- Axios for API requests
- Context API for state management
- Jest and React Testing Library for testing

## API Integration

This application integrates with the REST Countries API (v3.1) using the following endpoints:

- `/all` - Get information about all countries
- `/name/{name}` - Search countries by name
- `/region/{region}` - Filter countries by region
- `/alpha/{code}` - Get detailed information about a specific country

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
   git clone <repository-url>
   cd <repository-name>
2. Install dependencies
   npm install
3. Start the development server
   npm run dev
4. Open your browser and navigate to `http://localhost:3000`

## Testing

Run tests with: npm test

## Deployment

URL of the hosted application - `https://countries-explorer-pi.vercel.app/`
