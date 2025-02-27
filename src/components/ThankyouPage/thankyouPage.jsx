import React from 'react';
import { Button, Box, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import successImage from '../Assets/Social-media-manager.png'; // Import image

const ThankYouPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 10, position: 'relative' }}>
      {/* Success Image */}
      <img
        src={successImage}  // Use the imported image here
        alt="Success"
        style={{
          width: '100%',
          maxWidth: 300,
          marginBottom: 20,
          position: 'relative',
          zIndex: 2,
        }}
      />
      <Typography variant="h5" sx={{ mb: 2 }}>
        Your post has been posted successfully!
      </Typography>

      

      {/* Buttons aligned to the right */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/home')}
        >
          Back to Home
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={() => navigate('/signout')}
        >
          Exit
        </Button>
      </Box>

      {/* CSS for static confetti */}
      <style>{`
        .confetti-container {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 1;
        }

        .confetti {
          position: absolute;
          top: -10px;
          width: 10px;
          height: 20px;
          background-color: gold;
          opacity: 0.8;
          /* No animation here, just static confetti */
        }

        /* Remove @keyframes animations */
      `}</style>
    </Container>
  );
};

export default ThankYouPage;
