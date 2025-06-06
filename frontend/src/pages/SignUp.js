import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaUserAlt,
  FaEnvelope,
  FaLock,
  FaPhoneAlt,
  FaCheckCircle,
  FaUserPlus
} from "react-icons/fa";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    contact: "",
    userType: "Customer",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: "Customer", // Or any fixed/default role
        }),
      });

      if (response.ok) {
        alert("Signup successful!");
        navigate("/login");
      } else {
        const errData = await response.json();
        alert("Signup failed: " + (errData.message || "Server error"));
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("Network error. Please try again later.");
    }
  };

  const InputField = ({ icon: Icon, ...props }) => (
    <div className="flex items-center mb-4 px-3 py-2 border rounded-lg shadow-sm hover:border-blue-500 focus-within:ring-2 focus-within:ring-blue-400 transition">
      <Icon className="text-gray-500 mr-3" />
      <input
        {...props}
        className="w-full bg-transparent outline-none"
        required
      />
    </div>
  );

  return (
     <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-3xl shadow-2xl border border-blue-200 w-full max-w-md space-y-5"
      >
        <div className="flex justify-center mb-4">
          <img
            src="/logo.png" // Replace with actual logo path
            alt="Logo"
            className="w-20 h-20"
          />
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800">Welcome to ABC Company</h2>
        <p className="text-center text-gray-500">Sign up to your account and start ordering with us!</p>

        {/* Full Name */}
        <div className="flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-xl shadow-sm hover:border-blue-500 transition focus-within:ring-2 focus-within:ring-blue-400">
          <FaUserAlt className="text-blue-600" />
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-transparent outline-none text-sm"
            required
          />
        </div>

        {/* Email */}
        <div className="flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-xl shadow-sm hover:border-blue-500 transition focus-within:ring-2 focus-within:ring-blue-400">
          <FaEnvelope className="text-blue-600" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-transparent outline-none text-sm"
            required
          />
        </div>

        {/* Password */}
        <div className="flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-xl shadow-sm hover:border-blue-500 transition focus-within:ring-2 focus-within:ring-blue-400">
          <FaLock className="text-blue-600" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full bg-transparent outline-none text-sm"
            required
          />
        </div>

        {/* Confirm Password */}
        <div className="flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-xl shadow-sm hover:border-blue-500 transition focus-within:ring-2 focus-within:ring-blue-400">
          <FaCheckCircle className="text-blue-600" />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full bg-transparent outline-none text-sm"
            required
          />
        </div>

        {/* Contact */}
        <div className="flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-xl shadow-sm hover:border-blue-500 transition focus-within:ring-2 focus-within:ring-blue-400">
          <FaPhoneAlt className="text-blue-600" />
          <input
            type="tel"
            name="contact"
            placeholder="Contact Number"
            value={formData.contact}
            onChange={handleChange}
            className="w-full bg-transparent outline-none text-sm"
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg transition duration-300"
        >
          <FaUserPlus />
          Sign Up
        </button>

        <div className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log In
          </Link>
        </div>
      </form>
    </div>

  );
};

export default SignUp;
