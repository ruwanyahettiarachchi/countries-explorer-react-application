import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';

const CountryCard = ({ country }) => {
  const { isAuthenticated } = useAuth();
  const { addToFavorites, removeFromFavorites, isInFavorites } = useFavorites();
  const isFavorite = isInFavorites(country.cca3);

  const formatPopulation = (population) => {
    return population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleFavoriteToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isFavorite) {
      removeFromFavorites(country.cca3);
    } else {
      addToFavorites(country);
    }
  };

  return (
    <Link 
      to={`/country/${country.cca3}`}
      className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="h-40 overflow-hidden">
        <img 
          src={country.flags.svg || country.flags.png} 
          alt={`Flag of ${country.name.common}`}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h2 className="text-lg font-bold mb-2 text-gray-800">{country.name.common}</h2>
          
          {isAuthenticated && (
            <button 
              onClick={handleFavoriteToggle}
              className={`ml-2 focus:outline-none ${isFavorite ? 'text-yellow-500' : 'text-gray-400'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} 
                stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isFavorite ? 0 : 2} 
                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
            </button>
          )}
        </div>
        
        <div className="text-gray-700">
          <p><span className="font-semibold">Capital:</span> {country.capital?.[0] || 'N/A'}</p>
          <p><span className="font-semibold">Region:</span> {country.region}</p>
          <p><span className="font-semibold">Population:</span> {formatPopulation(country.population)}</p>
        </div>
      </div>
    </Link>
  );
};

export default CountryCard;