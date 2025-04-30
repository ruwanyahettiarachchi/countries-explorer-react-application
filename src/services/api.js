import axios from 'axios';

const BASE_URL = 'https://restcountries.com/v3.1';

// Get all countries
export const getAllCountries = async (fields = '') => {
  try {
    const endpoint = fields ? `/all?fields=${fields}` : '/all';
    const response = await axios.get(`${BASE_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all countries:', error);
    throw error;
  }
};

// Search countries by name
export const searchCountriesByName = async (name) => {
  try {
    const response = await axios.get(`${BASE_URL}/name/${name}`);
    return response.data;
  } catch (error) {
    console.error('Error searching countries by name:', error);
    if (error.response && error.response.status === 404) {
      return []; // Return empty array if no countries found
    }
    throw error;
  }
};

// Get countries by region
export const getCountriesByRegion = async (region) => {
  try {
    const response = await axios.get(`${BASE_URL}/region/${region}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching countries by region:', error);
    throw error;
  }
};

// Get country details by code
export const getCountryByCode = async (code) => {
  try {
    const response = await axios.get(`${BASE_URL}/alpha/${code}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching country by code:', error);
    throw error;
  }
};