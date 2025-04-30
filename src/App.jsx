import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';

// Components
import Header from './components/Header';

// Pages
import Home from './pages/Home';
import CountryDetails from './pages/CountryDetails';
import LoginPage from './pages/LoginPage';
import FavoritesPage from './pages/FavoritesPage';

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <Router>
          <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="pb-12">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/country/:code" element={<CountryDetails />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
              </Routes>
            </main>
            <footer className="bg-blue-600 text-white py-4">
              <div className="container mx-auto px-4 text-center">
                <p>&copy; {new Date().getFullYear()} Countries Explorer | Created for SE3040 Assignment</p>
                <p className="text-sm mt-1">Data provided by REST Countries API</p>
              </div>
            </footer>
          </div>
        </Router>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;