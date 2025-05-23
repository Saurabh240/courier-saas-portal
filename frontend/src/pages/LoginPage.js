import React from 'react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();

  const handleLogin = (role) => {
    login({ role });
  };

  return (
    <div>
      <h2>Login as:</h2>
      <button onClick={() => handleLogin('ADMIN')}>Admin</button>
      <button onClick={() => handleLogin('STAFF')}>Staff</button>
      <button onClick={() => handleLogin('PARTNER')}>Delivery Partner</button>
      <button onClick={() => handleLogin('CUSTOMER')}>Customer</button>
    </div>
  );
};

export default LoginPage;
