const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const handleResponse = async (response) => {
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }
    return data;
  }
  throw new Error('Invalid response from server');
};

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    console.log('Login response:', response);
    const data = await handleResponse(response);
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.user.name); // Store the user's name
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(error.message || 'Login failed');
  }
};

export const signup = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(userData),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Signup error:', error);
    throw new Error(error.message || 'Registration failed');
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username'); // Clear username on logout
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};

// Add new method to get username
export const getUsername = () => {
  return localStorage.getItem('username');
};
