import React, { createContext, useState, useEffect, useContext } from 'react';
import { getFavorites, addFavorite, removeFavorite } from '../services/auth';
import { useAuth } from './AuthContext';

// Create context
export const FavoritesContext = createContext();

// Create provider component
export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const { isAuthenticated } = useAuth();

  // Load favorites from cookies when component mounts or auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      setFavorites(getFavorites());
    } else {
      setFavorites([]);
    }
  }, [isAuthenticated]);

  // Add country to favorites
  const addToFavorites = (country) => {
    if (!isAuthenticated) return;
    
    const simplifiedCountry = {
      name: country.name,
      cca3: country.cca3,
      flags: country.flags,
      capital: country.capital,
      population: country.population,
      region: country.region
    };
    
    const updatedFavorites = addFavorite(simplifiedCountry);
    setFavorites(updatedFavorites);
  };

  // Remove country from favorites
  const removeFromFavorites = (countryCode) => {
    if (!isAuthenticated) return;
    
    const updatedFavorites = removeFavorite(countryCode);
    setFavorites(updatedFavorites);
  };

  // Check if a country is in favorites
  const isInFavorites = (countryCode) => {
    return favorites.some(country => country.cca3 === countryCode);
  };

  // Context value
  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isInFavorites
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Custom hook to use the favorites context
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};