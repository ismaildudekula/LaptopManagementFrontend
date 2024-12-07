import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';
import { useAuth } from '../context/AuthContext';

function LogoutButton() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/login');
  };

  return (
    <Button variant="outlined" color="secondary" onClick={handleLogout}>
      Logout
    </Button>
  );
}

export default LogoutButton;
