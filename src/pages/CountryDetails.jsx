import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCountryByCode } from '../services/api';
import Loading from '../components/Loading';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';

const CountryDetails = () => {
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { code } = useParams();
  const navigate = useNavigate();
  
  const { isAuthenticated } = useAuth();
  const { addToFavorites, removeFromFavorites, isInFavorites } = useFavorites();
  
  useEffect(() => {
    const fetchCountryDetails = async () => {
      try {
        setLoading(true);
        const data = await getCountryByCode(code);
        if (data && data.length > 0) {
          setCountry(data[0]);
          setError('');
        } else {
          setError('Country not found');
        }
      } catch (err) {
        console.error('Error fetching country details:', err);
        setError('Failed to load country details');
      } finally {
        setLoading(false);
      }
    };

    if (code) {
      fetchCountryDetails();
    }
  }, [code]);

  const formatPopulation = (population) => {
    return population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleFavoriteToggle = () => {
    if (!country) return;
    
    if (isInFavorites(country.cca3)) {
      removeFromFavorites(country.cca3);
    } else {
      addToFavorites(country);
    }
  };

  if (loading) return <Loading />;

  if (error || !country) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error || 'Country not found'}
        </div>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Home
        </button>
      </div>
    );
  }

  // Format languages from object to array
  const languages = country.languages ? Object.values(country.languages) : [];
  
  // Format currencies from object to array
  const currencies = country.currencies 
    ? Object.values(country.currencies).map(c => `${c.name} (${c.symbol || ''})`) 
    : [];
  
  // Get border countries codes
  const borderCodes = country.borders || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded shadow inline-flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>
        
        {isAuthenticated && (
          <button
            onClick={handleFavoriteToggle}
            className={`flex items-center px-4 py-2 rounded-md shadow ${
              isInFavorites(country.cca3)
                ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill={isInFavorites(country.cca3) ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={isInFavorites(country.cca3) ? 0 : 2}
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
            {isInFavorites(country.cca3) ? 'Remove from Favorites' : 'Add to Favorites'}
          </button>
        )}
      </div>

      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img
              src={country.flags.svg || country.flags.png}
              alt={`Flag of ${country.name.common}`}
              className="w-full h-auto object-cover"
            />
          </div>
          
          <div className="p-6 md:w-1/2">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {country.name.common}
            </h1>
            <p className="text-gray-600 mb-1"><span className="font-semibold">Official Name:</span> {country.name.official}</p>
            
            <div className="grid md:grid-cols-2 gap-x-4 gap-y-2 mt-6">
              <div>
                <p className="text-gray-600"><span className="font-semibold">Population:</span> {formatPopulation(country.population)}</p>
                <p className="text-gray-600"><span className="font-semibold">Region:</span> {country.region}</p>
                <p className="text-gray-600"><span className="font-semibold">Sub Region:</span> {country.subregion || 'N/A'}</p>
                <p className="text-gray-600"><span className="font-semibold">Capital:</span> {country.capital?.[0] || 'N/A'}</p>
              </div>
              
              <div>
                {country.tld && (
                  <p className="text-gray-600"><span className="font-semibold">Top Level Domain:</span> {country.tld.join(', ')}</p>
                )}
                
                {currencies.length > 0 && (
                  <p className="text-gray-600"><span className="font-semibold">Currencies:</span> {currencies.join(', ')}</p>
                )}
                
                {languages.length > 0 && (
                  <p className="text-gray-600"><span className="font-semibold">Languages:</span> {languages.join(', ')}</p>
                )}
              </div>
            </div>
            
            {borderCodes.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-2">Border Countries:</h2>
                <div className="flex flex-wrap gap-2">
                  {borderCodes.map((code) => (
                    <button
                      key={code}
                      onClick={() => navigate(`/country/${code}`)}
                      className="px-4 py-1 bg-gray-200 hover:bg-gray-300 rounded shadow text-sm"
                    >
                      {code}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryDetails;