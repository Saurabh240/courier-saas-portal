// src/components/Toast.js
import React, { useEffect } from "react";
import ReactDOM from "react-dom";

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const toastContent = (
    <div className="fixed top-5 right-5 z-50">
      <div
        className={`min-w-[250px] px-4 py-3 rounded-md shadow-lg text-white font-medium relative overflow-hidden ${
          type === "success" ? "bg-green-600" : "bg-red-600"
        }`}
      >
        {message}
        <div
          className={`absolute bottom-0 left-0 h-1 ${
            type === "success" ? "bg-green-300" : "bg-red-300"
          } animate-slide`}
        />
      </div>

      <style>
        {`
          @keyframes slide {
            0% { width: 100%; }
            100% { width: 0%; }
          }
          .animate-slide {
            animation: slide 3s linear forwards;
          }
        `}
      </style>
    </div>
  );

  return ReactDOM.createPortal(toastContent, document.body);
};

export default Toast;
