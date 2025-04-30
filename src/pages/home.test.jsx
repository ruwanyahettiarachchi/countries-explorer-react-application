import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';
import { getAllCountries, searchCountriesByName, getCountriesByRegion } from '../services/api';

// Mock the API functions
jest.mock('../services/api', () => ({
  getAllCountries: jest.fn(),
  searchCountriesByName: jest.fn(),
  getCountriesByRegion: jest.fn()
}));

// Mock the context providers
jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(() => ({
    isAuthenticated: false
  }))
}));

jest.mock('../context/FavoritesContext', () => ({
  useFavorites: jest.fn(() => ({
    addToFavorites: jest.fn(),
    removeFromFavorites: jest.fn(),
    isInFavorites: jest.fn(() => false)
  }))
}));

describe('Home page', () => {
  const mockCountries = [
    {
      cca3: 'DEU',
      name: {
        common: 'Germany',
        official: 'Federal Republic of Germany'
      },
      capital: ['Berlin'],
      region: 'Europe',
      population: 83240525,
      flags: {
        png: 'https://example.com/germany.png',
        svg: 'https://example.com/germany.svg'
      }
    },
    {
      cca3: 'FRA',
      name: {
        common: 'France',
        official: 'French Republic'
      },
      capital: ['Paris'],
      region: 'Europe',
      population: 67391582,
      flags: {
        png: 'https://example.com/france.png',
        svg: 'https://example.com/france.svg'
      }
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    getAllCountries.mockResolvedValue(mockCountries);
    searchCountriesByName.mockResolvedValue(mockCountries);
    getCountriesByRegion.mockResolvedValue(mockCountries);
  });

  const renderWithRouter = (ui) => {
    return render(
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    );
  };

  test('renders loading state initially', () => {
    renderWithRouter(<Home />);
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('fetches and displays countries on mount', async () => {
    renderWithRouter(<Home />);
    
    await waitFor(() => {
      expect(getAllCountries).toHaveBeenCalledWith('name,capital,population,region,subregion,flags,cca3,languages');
    });
    
    await waitFor(() => {
      expect(screen.getByText('Germany')).toBeInTheDocument();
      expect(screen.getByText('France')).toBeInTheDocument();
    });
  });

  test('allows searching for countries by name', async () => {
    renderWithRouter(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText('Germany')).toBeInTheDocument();
    });
    
    // Find the search input and button
    const searchInput = screen.getByPlaceholderText(/search for a country/i);
    const searchButton = screen.getByRole('button', { name: /search/i });
    
    // Type a search term and click search
    fireEvent.change(searchInput, { target: { value: 'Germany' } });
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(searchCountriesByName).toHaveBeenCalledWith('Germany');
    });
  });

  test('handles filtering by region', async () => {
    renderWithRouter(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText('Germany')).toBeInTheDocument();
    });
    
    // Find the region filter
    const regionSelect = screen.getByText(/filter by region/i);
    fireEvent.change(regionSelect, { target: { value: 'Europe' } });
    
    await waitFor(() => {
      expect(getCountriesByRegion).toHaveBeenCalledWith('Europe');
    });
  });

  test('displays error message when fetching fails', async () => {
    // Mock the API to reject
    getAllCountries.mockRejectedValue(new Error('Failed to load'));
    
    renderWithRouter(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText(/failed to load countries/i)).toBeInTheDocument();
    });
  });

  test('shows no countries message when search has no results', async () => {
    // First render with mock countries
    renderWithRouter(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText('Germany')).toBeInTheDocument();
    });
    
    // Then simulate a search with no results
    searchCountriesByName.mockResolvedValue([]);
    
    const searchInput = screen.getByPlaceholderText(/search for a country/i);
    const searchButton = screen.getByRole('button', { name: /search/i });
    
    fireEvent.change(searchInput, { target: { value: 'Nonexistent' } });
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(screen.getByText(/no countries found matching/i)).toBeInTheDocument();
    });
  });
});