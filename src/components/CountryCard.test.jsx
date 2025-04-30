import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CountryCard from './CountryCard';

// Mock the context hooks
jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(() => ({
    isAuthenticated: true
  }))
}));

jest.mock('../context/FavoritesContext', () => ({
  useFavorites: jest.fn(() => ({
    addToFavorites: jest.fn(),
    removeFromFavorites: jest.fn(),
    isInFavorites: jest.fn(() => false)
  }))
}));

describe('CountryCard component', () => {
  const mockCountry = {
    cca3: 'DEU',
    name: {
      common: 'Germany',
      official: 'Federal Republic of Germany'
    },
    capital: ['Berlin'],
    region: 'Europe',
    population: 83240525,
    flags: {
      png: 'https://example.com/flag.png',
      svg: 'https://example.com/flag.svg'
    }
  };

  // Helper function to render the component with router
  const renderWithRouter = (ui) => {
    return render(
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    );
  };

  test('renders country information correctly', () => {
    renderWithRouter(<CountryCard country={mockCountry} />);
    
    expect(screen.getByText('Germany')).toBeInTheDocument();
    expect(screen.getByText(/Berlin/i)).toBeInTheDocument();
    expect(screen.getByText(/Europe/i)).toBeInTheDocument();
    expect(screen.getByText(/83,240,525/i)).toBeInTheDocument();
    expect(screen.getByAltText('Flag of Germany')).toBeInTheDocument();
  });

  test('links to the correct country details page', () => {
    renderWithRouter(<CountryCard country={mockCountry} />);
    
    const cardLink = screen.getByRole('link');
    expect(cardLink).toHaveAttribute('href', '/country/DEU');
  });

  test('renders favorite button when authenticated', () => {
    renderWithRouter(<CountryCard country={mockCountry} />);
    
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('calls addToFavorites when favorite button is clicked', () => {
    const { useFavorites } = require('../context/FavoritesContext');
    const mockAddToFavorites = jest.fn();
    useFavorites.mockReturnValue({
      addToFavorites: mockAddToFavorites,
      removeFromFavorites: jest.fn(),
      isInFavorites: jest.fn(() => false)
    });
    
    renderWithRouter(<CountryCard country={mockCountry} />);
    
    const favoriteButton = screen.getByRole('button');
    fireEvent.click(favoriteButton);
    
    expect(mockAddToFavorites).toHaveBeenCalledWith(mockCountry);
  });

  test('calls removeFromFavorites when country is already a favorite', () => {
    const { useFavorites } = require('../context/FavoritesContext');
    const mockRemoveFromFavorites = jest.fn();
    useFavorites.mockReturnValue({
      addToFavorites: jest.fn(),
      removeFromFavorites: mockRemoveFromFavorites,
      isInFavorites: jest.fn(() => true)
    });
    
    renderWithRouter(<CountryCard country={mockCountry} />);
    
    const favoriteButton = screen.getByRole('button');
    fireEvent.click(favoriteButton);
    
    expect(mockRemoveFromFavorites).toHaveBeenCalledWith('DEU');
  });

  test('does not show favorite button when not authenticated', () => {
    const { useAuth } = require('../context/AuthContext');
    useAuth.mockReturnValue({
      isAuthenticated: false
    });
    
    renderWithRouter(<CountryCard country={mockCountry} />);
    
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});