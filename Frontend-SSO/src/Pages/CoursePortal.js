import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Paper, Box, Button, MenuItem, Select, FormControl, InputLabel, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CourseNavbar from '../Components/CourseNavbar';

const CoursePortal = ({ setIsLoggedIn, isLoggedIn }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [courseDetails, setCourseDetails] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        'http://localhost:8082/course/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
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
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/portal-selection');
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:8082/course/all-courses');
      console.log('Courses fetched:', response.data);
      setCourses(response.data);
      setMessage('');
    } catch (error) {
      console.error('Error fetching courses:', error);
      setMessage('Error fetching courses');
    }
  };

  const handleCourseSelection = (event) => {
    const courseName = event.target.value;
    setSelectedCourse(courseName);
    fetchCourseDetails(courseName);
  };

  const fetchCourseDetails = async (courseName) => {
    try {
      const response = await axios.post(
        'http://localhost:8082/course/details',
        { courseName },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setCourseDetails(response.data);
      setMessage('');
    } catch (error) {
      console.error('Error fetching course details:', error);
      setError('Error fetching course details');
    }
  };

  const handleRegisterCourse = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8082/course/register',
        { courseName: selectedCourse },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setMessage(response.data.message || 'Course registered successfully');
      setError('');
    } catch (error) {
      console.error('Error registering course:', error);
      setError('Error registering course');
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <CourseNavbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <Paper elevation={6} sx={{ padding: 2 }}>
        <Typography component="h1" variant="h5">Course Portal</Typography>
        <Button onClick={fetchCourses} variant="contained" sx={{ my: 2 }}>View Courses</Button>

        {courses.length > 0 ? (
          <FormControl fullWidth>
            <InputLabel id="course-select-label">Select a Course</InputLabel>
            <Select
              labelId="course-select-label"
              id="course-select"
              value={selectedCourse}
              label="Select a Course"
              onChange={handleCourseSelection}
            >
              {courses.map((course, index) => (
                <MenuItem key={index} value={course}>
                  {course}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <Typography variant="body2">No courses available.</Typography>
        )}

        {courseDetails && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Selected Course:</Typography>
            <Typography>Name: {courseDetails.courseName}</Typography>
            <Typography>Description: {courseDetails.description}</Typography>
          </Box>
        )}

        <Button onClick={handleRegisterCourse} variant="contained" color="primary" sx={{ mt: 2 }}>
          Register for Course
        </Button>

        {message && <Typography color="primary" variant="body2">{message}</Typography>}
        {error && <Typography color="error" variant="body2">{error}</Typography>}
      </Paper>
      <Snackbar open={Boolean(message) || Boolean(error)} autoHideDuration={6000} onClose={() => { setMessage(''); setError(''); }}>
        {message ? (
          <Alert onClose={() => setMessage('')} severity="success">
            {message}
          </Alert>
        ) : (
          <Alert onClose={() => setError('')} severity="error">
            {error}
          </Alert>
        )}
      </Snackbar>
    </Container>
  );
};

export default CoursePortal;
