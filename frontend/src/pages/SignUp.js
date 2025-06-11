// src/pages/SignUp.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaUserAlt,
  FaEnvelope,
  FaLock,
  FaPhoneAlt,
  FaCheckCircle,
  FaUserPlus,
} from "react-icons/fa";
import Toast from "../components/Toast";

// ✅ Moved Input component outside the SignUp component to avoid re-renders
const Input = ({ icon: Icon, ...props }) => (
  <div className="flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-xl shadow-sm hover:border-blue-500 transition focus-within:ring-2 focus-within:ring-blue-400">
    <Icon className="text-blue-600" />
    <input
      {...props}
      className="w-full bg-transparent outline-none text-sm"
      required
    />
  </div>
);

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    contact: "",
    userType: "CUSTOMER",
  });

  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validatePassword = (password) => {
    return (
      password.length >= 8 &&
      /[A-Za-z]/.test(password) &&
      /\d/.test(password)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(formData.password)) {
      setToast({
        message: "Password must be at least 8 characters and alphanumeric.",
        type: "error",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setToast({ message: "Passwords do not match.", type: "error" });
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          contact: formData.contact,
          role: "CUSTOMER", // Or any fixed/default role
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setToast({ message: "Signup successful!", type: "success" });
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setToast({
          message: result.message || "Signup failed. Try again.",
          type: "error",
        });
      }
    } catch (error) {
      setToast({ message: "Network error. Please try again.", type: "error" });
    }
  };

  return (
    <>
      {/* ✅ Toast via portal, so doesn't affect input focus */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-10 rounded-3xl shadow-2xl border border-blue-200 w-full max-w-md space-y-5"
        >
          <div className="flex justify-center mb-4">
            <img src="/logo.png" alt="Logo" className="w-20 h-20" />
          </div>

          <h2 className="text-2xl font-bold text-center text-gray-800">
            Welcome to ABC Company
          </h2>
          <p className="text-center text-gray-500">
            Sign up to your account and start ordering with us!
          </p>

          <Input
            key="name"
            icon={FaUserAlt}
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
          />
          <Input
            key="email"
            icon={FaEnvelope}
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <Input
            key="password"
            icon={FaLock}
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <Input
            key="confirmPassword"
            icon={FaCheckCircle}
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <Input
            key="contact"
            icon={FaPhoneAlt}
            type="tel"
            name="contact"
            placeholder="Contact Number"
            value={formData.contact}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg transition duration-300"
          >
            <FaUserPlus />
            Sign Up
          </button>

          <div className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Log In
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default SignUp;
