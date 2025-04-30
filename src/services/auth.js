import Cookies from 'js-cookie';

// Mock user database
const users = [
  { username: 'user1', password: 'password1' },
  { username: 'user2', password: 'password2' },
];

// Set session expiration to 1 day
const SESSION_EXPIRATION = 1;

export const login = (username, password) => {
  // Find user in our "database"
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  
  if (user) {
    // In a real app, you would get a token from the server
    const sessionData = {
      username: user.username,
      isAuthenticated: true,
      timestamp: new Date().getTime(),
    };
    
    // Store in cookie
    Cookies.set('user_session', JSON.stringify(sessionData), { expires: SESSION_EXPIRATION });
    return { success: true, username: user.username };
  }
  
  return { success: false, message: 'Invalid credentials' };
};

export const logout = () => {
  Cookies.remove('user_session');
  Cookies.remove('favorites');
  return { success: true };
};

export const checkAuth = () => {
  const sessionData = Cookies.get('user_session');
  
  if (!sessionData) {
    return { isAuthenticated: false };
  }
  
  try {
    const session = JSON.parse(sessionData);
    
    // Check if session is expired (optional extra check)
    const currentTime = new Date().getTime();
    const sessionTime = session.timestamp;
    const dayInMilliseconds = 24 * 60 * 60 * 1000;
    
    if (currentTime - sessionTime > SESSION_EXPIRATION * dayInMilliseconds) {
      Cookies.remove('user_session');
      return { isAuthenticated: false };
    }
    
    return { isAuthenticated: true, username: session.username };
  } catch (error) {
    console.error('Error parsing session data:', error);
    return { isAuthenticated: false };
  }
};

// Handle favorites
export const getFavorites = () => {
  const favoritesData = Cookies.get('favorites');
  return favoritesData ? JSON.parse(favoritesData) : [];
};

export const addFavorite = (country) => {
  const favorites = getFavorites();
  // Check if country already exists in favorites
  if (!favorites.some(fav => fav.cca3 === country.cca3)) {
    const updatedFavorites = [...favorites, country];
    Cookies.set('favorites', JSON.stringify(updatedFavorites), { expires: SESSION_EXPIRATION });
    return updatedFavorites;
  }
  return favorites;
};

export const removeFavorite = (countryCode) => {
  const favorites = getFavorites();
  const updatedFavorites = favorites.filter(country => country.cca3 !== countryCode);
  Cookies.set('favorites', JSON.stringify(updatedFavorites), { expires: SESSION_EXPIRATION });
  return updatedFavorites;
};