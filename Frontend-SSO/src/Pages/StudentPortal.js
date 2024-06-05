import React, { useState } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StudentNavbar from '../Components/StudentNavbar';
import { STUDENT_TOKEN_KEY } from '../config';

const StudentPortal = ({ setIsLoggedIn, isLoggedIn }) => {
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem(STUDENT_TOKEN_KEY);
    if (!token) {
      localLogout();
      return;
    }

    try {
      await axios.post(
        'http://localhost:8081/student/logout',
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
    } catch (error) {
      console.error('Error logging out from API:', error);
    } finally {
      localLogout();
    }
  };

  const localLogout = () => {
    localStorage.removeItem(STUDENT_TOKEN_KEY);
    setIsLoggedIn(false);
    navigate('/'); // Redirect to login page
  };

  const handleViewDetails = async () => {
    const token = localStorage.getItem(STUDENT_TOKEN_KEY);
    if (!token) {
      setError('No token found. Please log in again.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        'http://localhost:8081/student/details',
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        setStudentDetails(response.data);
      } else {
        setError('Failed to fetch student details.');
      }
    } catch (error) {
      setError('An error occurred while fetching student details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StudentNavbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to the Student Portal
        </Typography>
        <Typography variant="body1">
          This is where you can view your details.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleViewDetails}
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'View My Details'}
        </Button>
        {error && (
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        {studentDetails && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">Student Details</Typography>
            <Typography variant="body1">ID: {studentDetails.id}</Typography>
            <Typography variant="body1">Username: {studentDetails.username}</Typography>
            <Typography variant="body1">Name: {studentDetails.name}</Typography>
          </Box>
        )}
      </Box>
    </>
  );
};

export default StudentPortal;
