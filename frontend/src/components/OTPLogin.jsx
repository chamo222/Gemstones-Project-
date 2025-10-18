import React, { useState } from 'react';
import axios from '../api/axios';
import { toast } from 'react-toastify';
import OTPVerify from './OTPVerify';

const OTPLogin = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1); // 1 = request OTP, 2 = verify OTP

  const requestOtp = async () => {
    try {
      const res = await axios.post('/api/otp/request-otp', { email });
      if (res.data.success) {
        toast.success(res.data.message || 'OTP sent!');
        setStep(2);
      } else {
        toast.error(res.data.message || 'Failed to request OTP');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to request OTP');
    }
  };

  return (
    <div className="otp-login-container">
      {step === 1 ? (
        <div>
          <h2>Login / Reset Password</h2>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={requestOtp}>Request OTP</button>
        </div>
      ) : (
        <OTPVerify
          email={email}
          onSuccess={(token) => {
            if (onLoginSuccess) onLoginSuccess(token);
          }}
        />
      )}
    </div>
  );
};

export default OTPLogin;