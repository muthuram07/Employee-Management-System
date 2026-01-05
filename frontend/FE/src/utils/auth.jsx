/**
 * Save authentication data (token and role) to localStorage.
 * @param {string} token - The JWT token.
 * @param {string} role - The user's role (e.g., "ROLE_MANAGER", "ROLE_EMPLOYEE").
 */
export function saveAuthData(token, role) {
  localStorage.setItem('token', token);
  localStorage.setItem('role', role);
}

/**
 * Retrieve the JWT token from localStorage.
 * @returns {string|null} - The JWT token or null if not found.
 */
export function getToken() {
  return localStorage.getItem('token');
}

/**
 * Retrieve the user's role from localStorage.
 * @returns {string|null} - The user's role or null if not found.
 */
export function getRole() {
  return localStorage.getItem('role');
}

/**
 * Clear authentication data from localStorage.
 */
export function clearAuthData() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  console.log('Authentication data cleared.');
}

/**
 * Check if the user is authenticated.
 * @returns {boolean} - True if the token exists, false otherwise.
 */
export function isAuthenticated() {
  return !!getToken();
}