import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaLock } from "react-icons/fa";

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Logging in:', { username, password });
    // login(username, password); // Uncomment this if using AuthContext logic
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-blue-200 p-10">
        <div className="flex justify-center mb-6">
          <img
            src="/logo.png" // Replace with your actual logo path
            alt="Logo"
            className="w-16 h-16"
          />
        </div>

        <h2 className="text-3xl font-extrabold text-center text-gray-800">
          Welcome to ABC Company
        </h2>
        <p className="text-center text-gray-500 mt-2 mb-8">
          Log in to your account and start ordering with us!
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div className="flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-xl shadow-sm hover:border-blue-500 transition focus-within:ring-2 focus-within:ring-blue-400 bg-white">
            <FaUser className="text-blue-500 text-lg" />
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full bg-transparent outline-none text-sm"
              required
            />
          </div>

          {/* Password */}
          <div className="flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-xl shadow-sm hover:border-blue-500 transition focus-within:ring-2 focus-within:ring-blue-400 bg-white">
            <FaLock className="text-blue-500 text-lg" />
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-transparent outline-none text-sm"
              required
            />
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex justify-between items-center text-sm text-gray-600">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2 accent-blue-600" />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg transition duration-300"
          >
            LOGIN
          </button>
        </form>

        {/* Link to Sign Up */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
