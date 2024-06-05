// src/components/Login.js

import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Alert } from '@mui/material';
import axios from 'axios';
import { AUTH_TOKEN_KEY } from '../config';
import { useNavigate } from 'react-router-dom';

const Login = ({ open, onClose, onLoginSuccess }) => {
  // const[name,setName]=useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const[token,setToken]=useState('');
  const [error, setError] = useState('');

  const navigate=useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8080/auth/login', {username, password });
      const token = response.data.jwt;
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      // setToken(token);
      onLoginSuccess();
      onClose();
      navigate('/portal-selection');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Login</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          autoFocus
          margin="dense"
          label="Email Address"
          type="email"
          fullWidth
          variant="standard"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Password"
          type="password"
          fullWidth
          variant="standard"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleLogin}>Login</Button>
      </DialogActions>
    </Dialog>
  );
};

export default Login;

