import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// Mock the useAuth hook
jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn()
}));

describe('Header component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  const renderWithRouter = (ui) => {
    return render(
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    );
  };

  test('renders logo and home link correctly', () => {
    const { useAuth } = require('../context/AuthContext');
    useAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      logout: jest.fn()
    });
    
    renderWithRouter(<Header />);
    
    expect(screen.getByText(/countries explorer/i)).toBeInTheDocument();
    expect(screen.getByText(/home/i)).toBeInTheDocument();
  });

  test('shows login button when not authenticated', () => {
    const { useAuth } = require('../context/AuthContext');
    useAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      logout: jest.fn()
    });
    
    renderWithRouter(<Header />);
    
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.queryByText(/logout/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/favorites/i)).not.toBeInTheDocument();
  });

  test('shows user info, favorites, and logout when authenticated', () => {
    const logoutMock = jest.fn();
    const { useAuth } = require('../context/AuthContext');
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: { username: 'testuser' },
      logout: logoutMock
    });
    
    renderWithRouter(<Header />);
    
    expect(screen.getByText(/welcome, testuser/i)).toBeInTheDocument();
    expect(screen.getByText(/favorites/i)).toBeInTheDocument();
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
    expect(screen.queryByText(/login/i)).not.toBeInTheDocument();
  });

  test('calls logout function and navigates when logout button is clicked', () => {
    const logoutMock = jest.fn();
    const { useAuth } = require('../context/AuthContext');
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: { username: 'testuser' },
      logout: logoutMock
    });
    
    renderWithRouter(<Header />);
    
    const logoutButton = screen.getByText(/logout/i);
    fireEvent.click(logoutButton);
    
    expect(logoutMock).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});