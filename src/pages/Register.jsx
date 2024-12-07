import { useState } from 'react';
import { TextField, Button, Container, Paper, Typography, Alert, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', department: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await registerUser(formData);
      setSuccess(response.message || 'Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data || 'Registration failed. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Register
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            margin="normal"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <TextField
            fullWidth
            type="password"
            label="Password"
            margin="normal"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <TextField
            fullWidth
            label="Department"
            margin="normal"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          />
          <Button 
            fullWidth 
            variant="contained" 
            type="submit"
            sx={{ mt: 2 }}
          >
            Register
          </Button>
        </form>
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Already have an account? <Link onClick={() => navigate('/login')}>Login</Link>
        </Typography>
      </Paper>
    </Container>
  );
}

export default Register;
