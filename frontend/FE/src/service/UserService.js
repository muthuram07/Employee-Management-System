import axios from 'axios';

// Base URL for authentication API
const API_AUTH_URL = 'http://localhost:8081/api/auth';

/**
 * Authenticate user by sending login credentials.
 * @param {Object} user - The user object containing username and password.
 * @returns {Object} - The response data containing authentication details.
 */
export const authenticate = async (user) => {
  try {
    const response = await axios.post(`${API_AUTH_URL}/login`, user);
    return response.data;
  } catch (error) {
    console.error('Error during authentication:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Register a new user.
 * @param {Object} user - The user object containing registration details.
 * @returns {Object} - The response data confirming successful registration.
 */
export const registerUser = async (user) => {
  try {
    const response = await axios.post(`${API_AUTH_URL}/register`, user);
    return response.data;
  } catch (error) {
    console.error('Error during user registration:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Logout the user by clearing local storage and redirecting to the login page.
 */
export const logout = () => {
  localStorage.removeItem('jwtToken');
  localStorage.removeItem('username');
  console.log('User logged out successfully.');
  window.location.href = '/'; // Redirect to login page
};

/**
 * Fetch the current user's profile.
 * @returns {Object} - The response data containing user profile details.
 */
export const fetchUserProfile = async () => {
  try {
    const response = await axios.get(`${API_AUTH_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error.response?.data || error.message);
    throw error;
  }
};
