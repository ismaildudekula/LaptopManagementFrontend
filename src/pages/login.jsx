import { useState } from 'react';
import { TextField, Button, Container, Paper, Typography, Alert, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const user = await login(formData.email, formData.password);
      setUser(user);
      if (user.roles.includes('ROLE_ADMIN')) {
        navigate('/admin');
      } else if (user.roles.includes('ROLE_EMPLOYEE')) {
        navigate('/employee');
      }
    } catch (err) {
      setError('Invalid email or password.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleSubmit}>
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
          <Button 
            fullWidth 
            variant="contained" 
            type="submit"
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </form>
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Don't have an account? <Link onClick={() => navigate('/register')}>Register</Link>
        </Typography>
      </Paper>
    </Container>
  );
}

export default Login;
