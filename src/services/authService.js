export const BASE_URL = 'http://127.0.0.1:8000/api';

export const AuthService = {
  currentToken: null,
  tokenExpiry: null,

  async getToken() {
    // Check if token exists in memory
    if (this.currentToken) {
      return this.currentToken;
    }

    // Check if token exists in localStorage
    const storedToken = localStorage.getItem('authToken');
    const expiry = localStorage.getItem('tokenExpiry');
    
    if (!storedToken) {
      throw new Error('No authentication token found');
    }

    // Check if token is expired
    if (expiry && Date.now() > parseInt(expiry)) {
      await this.refreshToken();
    }

    // Return stored token
    return storedToken;
  },

  async login(email, password) {
    try {
      const response = await fetch(`${BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      const newToken = data.token;
      
      // Store token and expiry in localStorage
      localStorage.setItem('authToken', newToken);
      localStorage.setItem('tokenExpiry', Date.now() + 3600000); // 1 hour expiry
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userPassword', password);
      
      // Also store in memory for immediate use
      this.currentToken = newToken;
      
      return newToken;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  },

  async refreshToken(platform) {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No token found');
      }

      // Make a new login request with the same credentials
      const response = await fetch(`${BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email: localStorage.getItem('userEmail'),
          password: localStorage.getItem('userPassword')
        })
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      const newToken = data.token;
      
      if (!newToken) {
        throw new Error('No new token received');
      }

      // Update token storage
      localStorage.setItem('authToken', newToken);
      localStorage.setItem('tokenExpiry', Date.now() + 3600000); // 1 hour expiry
      this.currentToken = newToken;
      
      // Get fresh platform credentials
      const platformResponse = await fetch(`${BASE_URL}/auth/${platform}/authorize/`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${newToken}`
        }
      });

      if (!platformResponse.ok) {
        throw new Error('Failed to refresh platform credentials');
      }

      return newToken;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  },

  async checkAuth() {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        return false;
      }

      // Try to refresh token if it's expired
      const expiry = localStorage.getItem('tokenExpiry');
      if (expiry && Date.now() > parseInt(expiry)) {
        await this.refreshToken();
      }
      
      return true;
    } catch (error) {
      console.error('Error checking auth:', error);
      return false;
    }
  },

  async getUserInfo() {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${BASE_URL}/auth/user/`, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get user info');
    }

    return response.json();
  },

  async logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenExpiry');
  }
};
