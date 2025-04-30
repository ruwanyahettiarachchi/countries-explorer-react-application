import axios from 'axios';
import { 
  getAllCountries, 
  searchCountriesByName, 
  getCountriesByRegion, 
  getCountryByCode 
} from './api';

// Mock axios
jest.mock('axios');

describe('API Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllCountries', () => {
    test('fetches all countries with default parameters', async () => {
      const mockResponse = { data: [{ name: 'Germany' }, { name: 'France' }] };
      axios.get.mockResolvedValueOnce(mockResponse);
      
      const result = await getAllCountries();
      
      expect(axios.get).toHaveBeenCalledWith('https://restcountries.com/v3.1/all');
      expect(result).toEqual(mockResponse.data);
    });

    test('fetches all countries with specific fields', async () => {
      const mockResponse = { data: [{ name: 'Germany' }, { name: 'France' }] };
      axios.get.mockResolvedValueOnce(mockResponse);
      
      const result = await getAllCountries('name,capital');
      
      expect(axios.get).toHaveBeenCalledWith('https://restcountries.com/v3.1/all?fields=name,capital');
      expect(result).toEqual(mockResponse.data);
    });

    test('handles error when fetching all countries', async () => {
      const errorMessage = 'Network Error';
      axios.get.mockRejectedValueOnce(new Error(errorMessage));
      
      await expect(getAllCountries()).rejects.toThrow(errorMessage);
    });
  });

  describe('searchCountriesByName', () => {
    test('searches countries by name', async () => {
      const mockResponse = { data: [{ name: { common: 'Germany' } }] };
      axios.get.mockResolvedValueOnce(mockResponse);
      
      const result = await searchCountriesByName('Germany');
      
      expect(axios.get).toHaveBeenCalledWith('https://restcountries.com/v3.1/name/Germany');
      expect(result).toEqual(mockResponse.data);
    });

    test('returns empty array when no results found (404)', async () => {
      axios.get.mockRejectedValueOnce({ 
        response: { 
          status: 404,
          data: { message: 'Not Found' } 
        } 
      });
      
      const result = await searchCountriesByName('NonExistentCountry');
      
      expect(result).toEqual([]);
    });

    test('handles other errors when searching countries', async () => {
      const errorMessage = 'Server Error';
      axios.get.mockRejectedValueOnce(new Error(errorMessage));
      
      await expect(searchCountriesByName('Germany')).rejects.toThrow(errorMessage);
    });
  });

  describe('getCountriesByRegion', () => {
    test('fetches countries by region', async () => {
      const mockResponse = { data: [{ name: 'Germany' }, { name: 'France' }] };
      axios.get.mockResolvedValueOnce(mockResponse);
      
      const result = await getCountriesByRegion('Europe');
      
      expect(axios.get).toHaveBeenCalledWith('https://restcountries.com/v3.1/region/Europe');
      expect(result).toEqual(mockResponse.data);
    });

    test('handles error when fetching by region', async () => {
      const errorMessage = 'Network Error';
      axios.get.mockRejectedValueOnce(new Error(errorMessage));
      
      await expect(getCountriesByRegion('Europe')).rejects.toThrow(errorMessage);
    });
  });

  describe('getCountryByCode', () => {
    test('fetches country by code', async () => {
      const mockResponse = { data: [{ name: { common: 'Germany' } }] };
      axios.get.mockResolvedValueOnce(mockResponse);
      
      const result = await getCountryByCode('DEU');
      
      expect(axios.get).toHaveBeenCalledWith('https://restcountries.com/v3.1/alpha/DEU');
      expect(result).toEqual(mockResponse.data);
    });

    test('handles error when fetching by code', async () => {
      const errorMessage = 'Not Found';
      axios.get.mockRejectedValueOnce(new Error(errorMessage));
      
      await expect(getCountryByCode('XYZ')).rejects.toThrow(errorMessage);
    });
  });
});