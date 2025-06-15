import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, CircularProgress, Grid } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../services/authService';
import { ApiService } from '../../services/apiService';
import { SocialAuthService } from '../../services/socialAuthService';

const BASE_URL = 'http://127.0.0.1:8000/api';

const SocialMediaPost = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState('');
  const [userPlatforms, setUserPlatforms] = useState([]);
  const [media, setMedia] = useState(null);
  const [enableLikes, setEnableLikes] = useState(true);
  const [enableComments, setEnableComments] = useState(true);

  const handlePlatformSelect = async (platform) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(platform)) {
        return prev.filter(p => p !== platform);
      }
      return [...prev, platform];
    });

    if (!isAuthenticated) {
      try {
        const token = await AuthService.login(platform);
        setAuthToken(token);
        setIsAuthenticated(true);
        
        // Get user's connected platforms
        const response = await fetch(`${BASE_URL}/user-platforms/`, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user platforms');
        }

        const data = await response.json();
        setUserPlatforms(data);
      } catch (error) {
        console.error('Login error:', error);
        setError(error.message || 'Failed to authenticate. Please try again.');
        setIsAuthenticated(false);
      }
    } else {
      // If already authenticated, check if platform is selected
      const hasPlatform = userPlatforms.some(p => p.platform_name === platform);
      if (hasPlatform) {
        // setSelectedPlatform(platform);
      } else {
        setError(`You don't have credentials for ${platform}`);
      }
    }
  };

  const handlePost = async () => {
    if (!content.trim()) {
      setError('Content cannot be empty');
      return;
    }

    if (selectedPlatforms.length === 0) {
      setError('Please select at least one platform');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // First get the token from AuthService
      const token = await AuthService.getToken();
      if (!token) {
        setError('Please log in first');
        return;
      }

      // Make API call to create post with proper token
      const response = await fetch('http://127.0.0.1:8000/api/social/post/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({
          content: content,
          platforms: selectedPlatforms,
          enable_likes: enableLikes,
          enable_comments: enableComments
        })
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Post created:', data);
        setSuccess('Post created successfully!');
        setContent('');
        setSelectedPlatforms([]);
        setEnableLikes(false);
        setEnableComments(false);
        setError('');
        setMedia(null);
        navigate('/thankYouPage');
      } else if (response.status === 401) {
        // Try to refresh token if unauthorized
        try {
          // Get fresh token
          const newToken = await AuthService.getToken();
          if (!newToken) {
            throw new Error('Failed to get new token');
          }

          // Retry the post with new token
          const retryResponse = await fetch('http://127.0.0.1:8000/api/social/post/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${newToken}`
            },
            body: JSON.stringify({
              content: content,
              platforms: selectedPlatforms,
              enable_likes: enableLikes,
              enable_comments: enableComments
            })
          });

          if (!retryResponse.ok) {
            const retryData = await retryResponse.json();
            throw new Error(retryData.message || 'Failed to create post');
          }

          // If we get here, the retry was successful
          const retryData = await retryResponse.json();
          console.log('Post created:', retryData);
          setSuccess('Post created successfully!');
          setContent('');
          setSelectedPlatforms([]);
          setEnableLikes(false);
          setEnableComments(false);
          setError('');
          setMedia(null);
          navigate('/thankYouPage');
        } catch (error) {
          console.error('Error during retry:', error);
          throw new Error(error.message || 'Failed to create post');
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      setError(error.message || 'hello Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Create New Post
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {success && (
          <Typography color="success" sx={{ mb: 2 }}>
            {success}
          </Typography>
        )}

        <TextField
          fullWidth
          multiline
          rows={4}
          label="Post Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            startIcon={<FacebookIcon />}
            variant={selectedPlatforms.includes('facebook') ? 'contained' : 'outlined'}
            onClick={() => handlePlatformSelect('facebook')}
          >
            Facebook
          </Button>
          <Button
            startIcon={<LinkedInIcon />}
            variant={selectedPlatforms.includes('linkedin') ? 'contained' : 'outlined'}
            onClick={() => handlePlatformSelect('linkedin')}
          >
            LinkedIn
          </Button>
          <Button
            startIcon={<InstagramIcon />}
            variant={selectedPlatforms.includes('instagram') ? 'contained' : 'outlined'}
            onClick={() => handlePlatformSelect('instagram')}
          >
            Instagram
          </Button>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            {media && (
              <Typography variant="body2" color="textSecondary">
                Selected file: {media.name}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handlePost}
              disabled={loading || !content.trim() || selectedPlatforms.length === 0}
              fullWidth
            >
              {loading ? <CircularProgress size={24} /> : 'Post'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default SocialMediaPost;