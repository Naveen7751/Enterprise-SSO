import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Typography, Paper, Box, Snackbar } from '@mui/material';
import { css, keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { CSSTransition } from 'react-transition-group';
import MuiAlert from '@mui/material/Alert';
import { AUTH_TOKEN_KEY, COURSE_TOKEN_KEY } from '../config';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const zoomIn = keyframes`
  from {
    transform: scale(0.9);
  }
  to {
    transform: scale(1);
  }
`;

const StyledContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(to right, #b39ddb, #e6ceff);
`;

const ContentWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  padding-bottom: 4rem; // Space for footer
`;

const StyledPaper = styled(Paper)`
  padding: 2rem;
  animation: ${fadeIn} 1s ease-in, ${zoomIn} 0.5s ease-in;
  border-radius: 10px;
  background-color: #f5f5f5;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.1);
`;

const StyledButton = styled(Button)`
  background-color: #7e57c2;
  color: white;
  &:hover {
    background-color: #5e35b1;
  }
`;

const Footer = styled.footer`
  width: 100%;
  padding: 1rem 0;
  background-color: #f5f5f5;
  text-align: center;
  position: absolute;
  bottom: 0;
  left: 0;
`;

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CourseLogin = ({ setIsLoggedIn }) => {
  const [inProp, setInProp] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const navigate = useNavigate();

  useEffect(() => {
    setInProp(true);
  }, []);

  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  };

  const isTokenExpired = (token) => {
    const decodedToken = parseJwt(token);
    if (!decodedToken) return true;
    const currentTime = Date.now() / 1000; // Convert to seconds
    return decodedToken.exp < currentTime;
  };

  const handleSSOLogin = async () => {
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!token || isTokenExpired(token)) {
        setSnackbarMessage('Session expired. Please log in again.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        navigate('/login');
        return;
      }

      const response = await axios.post(
        'http://localhost:8082/course/sso-login',
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        const newToken = response.data.jwt;
        localStorage.setItem(COURSE_TOKEN_KEY, newToken); // Update JWT token
        setIsLoggedIn(true);
        setSnackbarMessage('Login successful. Redirecting to portal...');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setTimeout(() => {
          navigate('/course');
        }, 2000);
      } else {
        setSnackbarMessage('Login failed. Please try again.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage('Login error. Please check your credentials and try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <StyledContainer component="main" maxWidth="xs">
      <ContentWrapper>
        <CSSTransition in={inProp} timeout={500} classNames="fade" onEntered={() => setInProp(true)}>
          <StyledPaper elevation={6}>
            <Typography component="h1" variant="h5" sx={{ textAlign: 'center', marginBottom: '1rem' }}>
              Course Portal Login
            </Typography>
            <StyledButton
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSSOLogin}
              css={css`animation: ${fadeIn} 1s ease-in;`}
            >
              Sign In with SSO
            </StyledButton>
          </StyledPaper>
        </CSSTransition>
      </ContentWrapper>
      <Footer>
        <Typography variant="body2" color="textSecondary">
          © {new Date().getFullYear()} Your Company. All rights reserved.
        </Typography>
      </Footer>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </StyledContainer>
  );
};

export default CourseLogin;
