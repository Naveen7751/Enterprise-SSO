import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';

const StyledContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;

const PortalSelection = () => {
  const navigate = useNavigate();

  return (
    <StyledContainer>
      <Typography variant="h4" gutterBottom>
        Select a Portal
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button variant="contained" color="primary" onClick={() => navigate('/student/login')}>
        View Details
        </Button>
        <Button variant="contained" color="secondary" onClick={() => navigate('/course/login')}>
          My Courses
        </Button>
      </Box>
    </StyledContainer>
  );
};

export default PortalSelection;
