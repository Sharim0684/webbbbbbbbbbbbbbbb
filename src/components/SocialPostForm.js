import React, { useState, useEffect } from 'react';
import { SocialAuthService } from '../services/socialAuth.js';

const SocialPostForm = () => {
  const [content, setContent] = useState('');
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [availablePlatforms, setAvailablePlatforms] = useState([]);

  useEffect(() => {
    const fetchAvailablePlatforms = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('Not authenticated');
        }

        const response = await fetch('http://127.0.0.1:8000/api/platforms/', {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch platforms');
        }

        const data = await response.json();
        // Transform the data to match our frontend format
        const transformedPlatforms = data.platforms.map(platform => ({
          key: platform.key,
          name: platform.name,
          is_selected: platform.is_selected
        }));
        
        setAvailablePlatforms(transformedPlatforms);
      } catch (err) {
        console.error('Error fetching platforms:', err);
        setError('Failed to load available platforms');
      }
    };

    fetchAvailablePlatforms();
  }, []);

  const handlePlatformChange = (e) => {
    const value = e.target.value;
    if (platforms.includes(value)) {
      setPlatforms(platforms.filter(p => p !== value));
    } else {
      setPlatforms([...platforms, value]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Convert platforms array to bitmask format
      let platformsBitmask = 0;
      if (platforms.includes('facebook')) platformsBitmask |= 2;
      if (platforms.includes('linkedin')) platformsBitmask |= 4;
      if (platforms.includes('instagram')) platformsBitmask |= 8;

      if (platformsBitmask === 0) {
        throw new Error('Please select at least one platform');
      }

      const response = await SocialAuthService.createPost(
        content,
        platformsBitmask,
        null // Add media handling later
      );

      setSuccess('Post created successfully!');
      setContent('');
      setPlatforms([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('media', file);

      // Handle media upload here
      // For now, just show the file name
      setError(`File selected: ${file.name}`);
    }
  };

  return (
    <div className="social-post-form">
      <h2>Post to Social Media</h2>
      
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            placeholder="Write your post here..."
          />
        </div>

        <div className="form-group">
          <label>Platforms:</label>
          <div className="platforms">
            {availablePlatforms.map(platform => (
              <label key={platform.key}>
                <input
                  type="checkbox"
                  value={platform.key}
                  checked={platforms.includes(platform.key)}
                  onChange={handlePlatformChange}
                  disabled={!platform.is_selected}
                />
                <span style={{ color: !platform.is_selected ? '#ccc' : '#000' }}>
                  {platform.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="media">Media (optional):</label>
          <input
            type="file"
            id="media"
            onChange={handleFileUpload}
            accept="image/*,video/*"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Posting...' : 'Post'}
        </button>
      </form>
    </div>
  );
};

export default SocialPostForm;
