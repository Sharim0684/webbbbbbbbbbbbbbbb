import { AuthService } from './authService';

export const ApiService = {
  async authorizedRequest(method, url, data = null, isFormData = false) {
    try {
      // Get authentication headers
      const headers = await AuthService.getHeaders();
      
      // Add CSRF token if needed
      const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value;
      if (csrfToken) {
        headers['X-CSRFToken'] = csrfToken;
      }

      // Create request config
      const config = {
        method: method,
        headers: headers,
        credentials: 'include'  // Include cookies for CSRF
      };

      // Add body if data exists
      if (data !== null) {
        if (isFormData) {
          config.body = data;
        } else {
          config.body = JSON.stringify(data);
          config.headers['Content-Type'] = 'application/json';
        }
      }

      // Make request
      const response = await fetch(url, config);

      // Check for token refresh needed
      if (response.status === 401) {
        // Try to refresh token
        await AuthService.refreshToken();
        
        // Retry request with new token
        const newHeaders = await AuthService.getHeaders();
        config.headers = newHeaders;
        
        if (csrfToken) {
          config.headers['X-CSRFToken'] = csrfToken;
        }

        return fetch(url, config);
      }

      return response;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  },

  async get(url) {
    return this.authorizedRequest('GET', url);
  },

  async post(url, data, isFormData = false) {
    return this.authorizedRequest('POST', url, data, isFormData);
  },

  async put(url, data) {
    return this.authorizedRequest('PUT', url, data);
  },

  async delete(url) {
    return this.authorizedRequest('DELETE', url);
  }
};
