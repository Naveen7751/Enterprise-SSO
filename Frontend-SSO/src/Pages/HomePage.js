import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/system';
import image from '../images/image.png'; // Adjust the path to your actual image file
import Login from '../Components/Login';
import Register from '../Components/Register';

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  const handleLoginOpen = () => setLoginOpen(true);
  const handleLoginClose = () => setLoginOpen(false);

  const handleRegisterOpen = () => setRegisterOpen(true);
  const handleRegisterClose = () => setRegisterOpen(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    handleLoginClose();
  };

  const ImageBox = styled(Box)({
    width: '100%',
    height: '40vh',
    backgroundImage: `url(${image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    transition: 'all 0.5s ease-in-out',
    filter: 'brightness(70%)',
    '&:hover': {
      filter: 'brightness(100%)',
      transform: 'scale(1.05)',
    },
  });

  const AnimatedButton = styled(Button)({
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.1)',
    },
  });

  return (
    <Box>
      <ImageBox />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: 4,
          backgroundColor: '#f0f0f0',
          height: '60vh',
        }}
      >
        <Typography variant="h3" gutterBottom sx={{ color: '#1976d2' }}>
          Welcome to Student Portal
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ color: '#555' }}>
          Sign In to Proceed
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <AnimatedButton variant="contained" color="primary" onClick={handleLoginOpen}>
            Sign In
          </AnimatedButton>
          <AnimatedButton variant="contained" color="secondary" onClick={handleRegisterOpen}>
            Register
          </AnimatedButton>
        </Box>
        <Typography variant="body2" sx={{ mt: 5, color: '#777' }}>
          In case of any technical issue, please reach out to support team
          (Gondunikhil5061@gmail.com)
        </Typography>
      </Box>
      <Login open={loginOpen} onClose={handleLoginClose} onLoginSuccess={handleLoginSuccess} />
      <Register open={registerOpen} onClose={handleRegisterClose} />
    </Box>
  );
};

export default HomePage;
