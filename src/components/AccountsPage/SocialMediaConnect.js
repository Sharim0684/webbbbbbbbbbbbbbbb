import React, { useEffect } from 'react';
import { Button, Box, Typography } from '@mui/material';

const SocialMediaConnect = () => {
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'social_auth') {
        // Log access token to browser console
        console.log(`${event.data.provider} Access Token:`, event.data.access_token);
        
        // Store token in localStorage for later use
        localStorage.setItem(`${event.data.provider.toLowerCase()}_token`, event.data.access_token);
        
        // Additional log to confirm token storage
        console.log('Token stored successfully for:', event.data.provider);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleLinkedInLogin = () => {
    const width = 600;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    
    window.open(
      'http://127.0.0.1:8000/api/linkedin_auth/login/',
      'LinkedIn Login',
      `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`
    );
  };

  const handleFacebookLogin = () => {
    window.open('http://40.192.26.134/accounts/facebook/login/', 'Facebook Login', 'width=600,height=600');
  };

  const handleInstagramLogin = () => {
    window.open('http://127.0.0.1:8000/accounts/instagram/login/', 'Instagram Login', 'width=600,height=600');
  };

  const handleTwitterLogin = () => {
    window.open('http://127.0.0.1:8000/accounts/twitter/login/', 'Twitter Login', 'width=600,height=600');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Connect Your Social Media Accounts</Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button 
          variant="contained" 
          onClick={handleLinkedInLogin}
          sx={{ backgroundColor: '#0077B5', '&:hover': { backgroundColor: '#006097' } }}
        >
          Connect LinkedIn
        </Button>

        <Button 
          variant="contained" 
          onClick={handleFacebookLogin}
          sx={{ backgroundColor: '#1877F2', '&:hover': { backgroundColor: '#1664D9' } }}
        >
          Connect Facebook
        </Button>

        <Button 
          variant="contained" 
          onClick={handleInstagramLogin}
          sx={{ backgroundColor: '#E4405F', '&:hover': { backgroundColor: '#D63B54' } }}
        >
          Connect Instagram
        </Button>

        <Button 
          variant="contained" 
          onClick={handleTwitterLogin}
          sx={{ backgroundColor: '#1DA1F2', '&:hover': { backgroundColor: '#1A91DA' } }}
        >
          Connect Twitter
        </Button>
      </Box>
    </Box>
  );
};

export default SocialMediaConnect;