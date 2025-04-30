import React, { useState, useEffect } from 'react';

const Filters = ({ onFilterByRegion, onFilterByLanguage }) => {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [languages, setLanguages] = useState([]);
  
  const regions = [
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania'
  ];
  
  // Common languages
  useEffect(() => {
    // In a real implementation, you might want to fetch this dynamically 
    // from the countries data to get all available languages
    setLanguages([
      'English',
      'Spanish',
      'French',
      'Arabic',
      'Chinese',
      'Russian',
      'Portuguese',
      'German'
    ]);
  }, []);

  const handleRegionChange = (e) => {
    const region = e.target.value;
    setSelectedRegion(region);
    onFilterByRegion(region);
    
    // Reset language filter when changing region
    setSelectedLanguage('');
  };

  const handleLanguageChange = (e) => {
    const language = e.target.value;
    setSelectedLanguage(language);
    onFilterByLanguage(language);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:justify-center gap-4 mb-6">
      <div className="relative">
        <select
          value={selectedRegion}
          onChange={handleRegionChange}
          className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">Filter by Region</option>
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>

      <div className="relative">
        <select
          value={selectedLanguage}
          onChange={handleLanguageChange}
          className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">Filter by Language</option>
          {languages.map((language) => (
            <option key={language} value={language.toLowerCase()}>
              {language}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>
      
      {(selectedRegion || selectedLanguage) && (
        <button
          onClick={() => {
            setSelectedRegion('');
            setSelectedLanguage('');
            onFilterByRegion('');
            onFilterByLanguage('');
          }}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded shadow focus:outline-none focus:shadow-outline"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default Filters;