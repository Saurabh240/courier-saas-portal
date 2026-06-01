import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Welcome to ABC Company</h1>
      <p className="mb-4">Please login or sign up to continue.</p>
      <div className="space-x-4">
        <Link to="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
        <Link to="/signup" className="text-blue-600 hover:underline">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Home;
