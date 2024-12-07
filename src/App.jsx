/* eslint-disable react/prop-types */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/Dashboard';
import LaptopManagement from './pages/admin/LaptopManagement'; // Import Laptop Management page
import EmployeeManagement from './pages/admin/EmployeeManagement'; // Import Employee Management page
import EmployeePortal from './pages/employee/Portal';
import { useAuth } from './context/AuthContext';

function App() {
  const { user } = useAuth();

  // Redirect logic based on user roles
  const DefaultRoute = () => {
    if (!user) {
      return <Navigate to="/login" />;
    }
    if (user.roles.includes('ROLE_ADMIN')) {
      return <Navigate to="/admin" />;
    }
    if (user.roles.includes('ROLE_EMPLOYEE')) {
      return <Navigate to="/employee" />;
    }
    return <Navigate to="/login" />; // Fallback
  };

  const AdminRoute = ({ children }) => {
    return user && user.roles.includes('ROLE_ADMIN') ? children : <Navigate to="/login" />;
  };

  const EmployeeRoute = ({ children }) => {
    return user && user.roles.includes('ROLE_EMPLOYEE') ? children : <Navigate to="/login" />;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Default Route */}
        <Route path="/" element={<DefaultRoute />} />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <Routes>
                <Route path="" element={<AdminDashboard />} />
                <Route path="laptops" element={<LaptopManagement />} />
                <Route path="employees" element={<EmployeeManagement />} />
              </Routes>
            </AdminRoute>
          }
        />

        {/* Employee Routes */}
        <Route
          path="/employee/*"
          element={
            <EmployeeRoute>
              <EmployeePortal />
            </EmployeeRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
