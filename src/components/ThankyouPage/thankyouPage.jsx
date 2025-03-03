import React from 'react';
import { Button, Box, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import successImage from '../Assets/Social-media-manager.png'; // Import image
import Header from "../Header";
const ThankYouPage = () => {
  const navigate = useNavigate();

  return (
    <Box>
    <Box sx={{ width: "100%" }}>
        <Header />
    </Box>
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Success Image */}
      <Box
        component="img"
        src={successImage}  // Use the imported image here
        alt="Success"
        sx={{
          width: '80%',
          maxWidth: 300,
          mb: 3,
          position: 'relative',
          zIndex: 2,
        }}
      />
      <Typography variant="h5" sx={{ mb: 2 }}>
        Your post has been posted successfully!
      </Typography>

      {/* Buttons aligned to the right */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3, width: '100%' }}>
        <Button
          variant="contained"
          onClick={() => navigate('/')}
          sx={{
            backgroundColor: '#561f5b',
            color: '#ffffff',
            '&:hover': { backgroundColor: '#420f45' },
          }}
        >
          Back to Home
        </Button>

        <Button
          variant="contained"
          onClick={() => navigate('/login')}
          sx={{
            backgroundColor: '#561f5b',
            color: '#ffffff',
            '&:hover': { backgroundColor: '#420f45' },
          }}
        >
          Exit
        </Button>
      </Box>
    </Container>
    </Box>
  );
};

export default ThankYouPage;
