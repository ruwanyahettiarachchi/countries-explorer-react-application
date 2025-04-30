import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from './SearchBar';

describe('SearchBar component', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    expect(screen.getByPlaceholderText('Search for a country...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  test('updates input value when typing', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search for a country...');
    fireEvent.change(input, { target: { value: 'Germany' } });
    
    expect(input.value).toBe('Germany');
  });

  test('calls onSearch when form is submitted', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search for a country...');
    const searchButton = screen.getByRole('button', { name: /search/i });
    
    fireEvent.change(input, { target: { value: 'Germany' } });
    fireEvent.click(searchButton);
    
    expect(mockOnSearch).toHaveBeenCalledWith('Germany');
  });

  test('prevents form submission with empty search term', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const searchButton = screen.getByRole('button', { name: /search/i });
    
    fireEvent.click(searchButton);
    
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  test('shows clear button when there is input and clears on click', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search for a country...');
    
    // Initially, clear button should not be present
    expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument();
    
    // After typing, clear button should appear
    fireEvent.change(input, { target: { value: 'Germany' } });
    const clearButton = screen.getByRole('button', { name: /clear/i });
    expect(clearButton).toBeInTheDocument();
    
    // Clicking clear button should clear input and call onSearch with empty string
    fireEvent.click(clearButton);
    expect(input.value).toBe('');
    expect(mockOnSearch).toHaveBeenCalledWith('');
  });
});