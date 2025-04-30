import React, { useState, useEffect } from 'react';
import { getAllCountries, searchCountriesByName, getCountriesByRegion } from '../services/api';
import CountryCard from '../components/CountryCard';
import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';
import Loading from '../components/Loading';

const Home = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all countries when component mounts
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        // Specify the fields to reduce response size
        const fields = 'name,capital,population,region,subregion,flags,cca3,languages';
        const data = await getAllCountries(fields);
        setCountries(data);
        setFilteredCountries(data);
        setError('');
      } catch (err) {
        console.error('Error fetching countries:', err);
        setError('Failed to load countries. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // Handle search
  const handleSearch = async (searchTerm) => {
    if (!searchTerm) {
      setFilteredCountries(countries);
      return;
    }

    try {
      setLoading(true);
      const data = await searchCountriesByName(searchTerm);
      setFilteredCountries(data);
      setError('');
    } catch (err) {
      console.error('Error searching countries:', err);
      setFilteredCountries([]);
      setError(`No countries found matching "${searchTerm}"`);
    } finally {
      setLoading(false);
    }
  };

  // Handle region filter
  const handleFilterByRegion = async (region) => {
    if (!region) {
      setFilteredCountries(countries);
      return;
    }

    try {
      setLoading(true);
      const data = await getCountriesByRegion(region);
      setFilteredCountries(data);
      setError('');
    } catch (err) {
      console.error('Error filtering by region:', err);
      setFilteredCountries([]);
      setError(`No countries found in region "${region}"`);
    } finally {
      setLoading(false);
    }
  };

  // Handle language filter
  const handleFilterByLanguage = (language) => {
    if (!language) {
      setFilteredCountries(countries);
      return;
    }

    setLoading(true);
    const filtered = countries.filter(country => {
      if (!country.languages) return false;
      return Object.values(country.languages)
        .some(lang => lang.toLowerCase().includes(language.toLowerCase()));
    });

    setFilteredCountries(filtered);
    
    if (filtered.length === 0) {
      setError(`No countries found with language "${language}"`);
    } else {
      setError('');
    }
    
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Explore Countries</h1>
      
      <SearchBar onSearch={handleSearch} />
      
      <Filters 
        onFilterByRegion={handleFilterByRegion} 
        onFilterByLanguage={handleFilterByLanguage} 
      />
      
      {loading ? (
        <Loading />
      ) : error ? (
        <div className="text-center text-red-500 py-4">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCountries.map(country => (
            <CountryCard key={country.cca3} country={country} />
          ))}
        </div>
      )}
      
      {!loading && !error && filteredCountries.length === 0 && (
        <div className="text-center text-gray-500 py-8">No countries found matching your criteria.</div>
      )}
    </div>
  );
};

export default Home;