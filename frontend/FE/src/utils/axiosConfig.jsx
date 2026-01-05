import axios from 'axios';

// Create an Axios instance with a base URL
const instance = axios.create({
  baseURL: 'http://localhost:8081', // Replace with your backend URL
});

/**
 * Interceptor to attach the JWT token to every request (if available).
 */
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Error in request interceptor:', error);
    return Promise.reject(error);
  }
);

/**
 * Interceptor to handle response errors globally.
 */
function showPopup(message) {
  // Simple custom popup using window.confirm as a fallback
  const popup = document.createElement('div');
  popup.style.position = 'fixed';
  popup.style.top = '0';
  popup.style.left = '0';
  popup.style.width = '100vw';
  popup.style.height = '100vh';
  popup.style.background = 'rgba(0,0,0,0.4)';
  popup.style.display = 'flex';
  popup.style.alignItems = 'center';
  popup.style.justifyContent = 'center';
  popup.style.zIndex = '9999';

  const box = document.createElement('div');
  box.style.background = '#fff';
  box.style.padding = '2rem 2.5rem';
  box.style.borderRadius = '8px';
  box.style.boxShadow = '0 2px 16px rgba(0,0,0,0.2)';
  box.style.textAlign = 'center';

  const msg = document.createElement('div');
  msg.textContent = message;
  msg.style.marginBottom = '1.5rem';
  msg.style.fontWeight = 'bold';

  const btn = document.createElement('button');
  btn.textContent = 'Close';
  btn.style.padding = '0.5rem 1.5rem';
  btn.style.background = '#007bff';
  btn.style.color = '#fff';
  btn.style.border = 'none';
  btn.style.borderRadius = '4px';
  btn.style.cursor = 'pointer';
  btn.onclick = () => document.body.removeChild(popup);

  box.appendChild(msg);
  box.appendChild(btn);
  popup.appendChild(box);
  document.body.appendChild(popup);
}

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized errors
      if (error.response.status === 401) {
        console.error('Unauthorized access - redirecting to login.');
        localStorage.removeItem('token');
        window.location.href = '/'; // Redirect to login page
      }

      // Handle 403 Forbidden errors
      if (error.response.status === 403) {
        console.error('Access forbidden - insufficient permissions.');
        showPopup('You do not have permission to perform this action.');
      }
    } else if (error.request) {
      console.error('No response received from the server.');
      showPopup('Network error: Unable to reach the server. Please try again later.');
    } else {
      console.error('Error in request setup:', error.message);
    }

    return Promise.reject(error);
  }
);

export default instance;
