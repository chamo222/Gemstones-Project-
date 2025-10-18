import React, { useState, useRef, useEffect } from 'react';
import axios from '../api/axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const OTPVerify = ({ email, onSuccess }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  // Auto focus first box on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (value, index) => {
    if (!/^[0-9]*$/.test(value)) return; // only numbers allowed

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next box if value entered
    if (value && index < 5) inputRefs.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const verifyOtp = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      toast.error('Please enter the full 6-digit OTP');
      return;
    }

    try {
      const res = await axios.post('/api/otp/verify-otp', { email, otp: enteredOtp });
      if (res.data.success) {
        toast.success('✅ OTP verified successfully!');
        if (onSuccess) onSuccess(res.data.token || 'dummyToken');
      } else {
        toast.error(res.data.message || 'Invalid OTP');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'OTP verification failed');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center p-6 w-full max-w-md mx-auto bg-white shadow-md rounded-2xl"
    >
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Enter Verification Code</h2>
      <p className="text-gray-500 mb-6 text-center">
        We’ve sent a 6-digit code to <strong>{email}</strong>
      </p>

      {/* OTP Input Boxes */}
      <div className="flex gap-3 justify-center mb-6">
        {otp.map((digit, index) => (
          <motion.input
            key={index}
            type="text"
            maxLength="1"
            value={digit}
            ref={(el) => (inputRefs.current[index] = el)}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            whileFocus={{ scale: 1.1, borderColor: '#007BFF' }}
            className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all duration-150"
          />
        ))}
      </div>

      {/* Verify Button */}
      <motion.button
        onClick={verifyOtp}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200"
      >
        Verify OTP
      </motion.button>
    </motion.div>
  );
};

export default OTPVerify;