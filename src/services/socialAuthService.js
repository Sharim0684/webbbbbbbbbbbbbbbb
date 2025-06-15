const BASE_URL = 'http://127.0.0.1:8000/api';

export const SocialAuthService = {
  async getCredentials() {
    try {
      const response = await fetch(`${BASE_URL}/social/get-credentials/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch social media credentials');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching credentials:', error);
      throw error;
    }
  },

  async postToFacebook(content, media = null) {
    try {
      const response = await fetch(`${BASE_URL}/social/post/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          content: content,
          platform: ['facebook'],
          enable_likes: true,
          enable_comments: true
        })
      });

      if (!response.ok) {
        throw new Error('Failed to post to Facebook');
      }

      return true;
    } catch (error) {
      console.error('Error posting to Facebook:', error);
      throw error;
    }
  },

  async postToLinkedIn(content, media = null) {
    try {
      const response = await fetch(`${BASE_URL}/social/post/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          content: content,
          platform: ['linkedin'],
          enable_likes: true,
          enable_comments: true
        })
      });

      if (!response.ok) {
        throw new Error('Failed to post to LinkedIn');
      }

      return true;
    } catch (error) {
      console.error('Error posting to LinkedIn:', error);
      throw error;
    }
  },

  async postToInstagram(content, media = null) {
    try {
      const response = await fetch(`${BASE_URL}/social/post/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          content: content,
          platform: ['instagram'],
          enable_likes: true,
          enable_comments: true
        })
      });

      if (!response.ok) {
        throw new Error('Failed to post to Instagram');
      }

      return true;
    } catch (error) {
      console.error('Error posting to Instagram:', error);
      throw error;
    }
  }
};
