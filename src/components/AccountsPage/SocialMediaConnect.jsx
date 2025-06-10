const getLinkedInAccessToken = async (code) => {
  try {
    // Update the endpoint to match your FastAPI route
    const response = await fetch('http://127.0.0.1:8000/linkedin/callback', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get LinkedIn access token');
    }

    const data = await response.json();
    if (data.status === 'success') {
      // Store the token
      localStorage.setItem('linkedin_access_token', data.access_token);
      return data.access_token;
    } else {
      throw new Error(data.message || 'Failed to get LinkedIn access token');
    }
  } catch (error) {
    console.error('LinkedIn Token Exchange Error:', error);
    throw error;
  }
};