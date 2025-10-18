import React, { useState } from 'react';
import axios from '../api/axios';
import { toast } from 'react-toastify';

const SignupWithOTP = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');

  const requestOtp = async () => {
    try {
      const res = await axios.post('/api/otp/signup-request', { name, email, password });
      if (res.data.success) {
        toast.success(res.data.message);
        setStep(2);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await axios.post('/api/otp/signup-verify', { email, otp });
      if (res.data.success) {
        toast.success('Account created successfully!');
        // Store token
        localStorage.setItem('token', res.data.token);
        // Redirect or update context
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Invalid OTP');
    }
  };

  return (
    <div className="signup-otp-container">
      {step === 1 ? (
        <div>
          <h2>Create Account</h2>
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={requestOtp}>Send OTP</button>
        </div>
      ) : (
        <div>
          <h2>Enter OTP</h2>
          <input type="text" placeholder="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
          <button onClick={verifyOtp}>Verify & Create Account</button>
        </div>
      )}
    </div>
  );
};

export default SignupWithOTP;