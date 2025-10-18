import React, { useState, useContext, useRef, useEffect } from 'react';
import loginImg from "../assets/Login.png";
import axios from '../api/axios';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { motion } from "framer-motion";

const Login = () => {
  const { setToken } = useContext(ShopContext);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = new URLSearchParams(location.search).get('redirect') || '/';

  const [currState, setCurrState] = useState('Login'); // Login | Sign Up | Forgot
  const [step, setStep] = useState('credentials'); // credentials | otp
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otp, setOtp] = useState('');

  // Refs for OTP boxes
  const otpRefs = useRef([]);

  useEffect(() => {
    if (step === "otp" && otpRefs.current[0]) otpRefs.current[0].focus();
  }, [step]);

  /* ------------------ LOGIN / SIGNUP / FORGOT REQUEST ------------------ */
  const handleRequest = async () => {
    try {
      if (currState === 'Login') {
        if (!email || !password) return toast.error("Email and password required");
        const res = await axios.post('/api/user/login', { email, password });
        if (res.data.success) {
          toast.success("Logged in successfully!");
          setToken(res.data.token);
          localStorage.setItem('token', res.data.token);
          navigate(redirectPath);
        } else toast.error(res.data.message);
        return;
      }

      if (currState === 'Sign Up') {
        if (!name || !email || !password) return toast.error("All fields required");
        const res = await axios.post('/api/otp/signup-request', { name, email, password });
        if (res.data.success) {
          toast.success("OTP sent to email");
          setStep('otp');
        } else toast.error(res.data.message);
        return;
      }

      if (currState === 'Forgot') {
        if (!email) return toast.error("Email required");
        const res = await axios.post('/api/otp/forgot-password-request', { email });
        if (res.data.success) {
          toast.success("OTP sent to your email");
          setStep('otp');
        } else toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  /* ------------------ VERIFY OTP ------------------ */
  const handleOtpVerify = async () => {
    try {
      if (!otp) return toast.error("Enter OTP");

      if (currState === 'Sign Up') {
        const res = await axios.post('/api/otp/signup-verify', { name, email, password, otp });
        if (res.data.success) {
          toast.success("Account created successfully!");
          setToken(res.data.token);
          localStorage.setItem('token', res.data.token);
          navigate(redirectPath);
        } else toast.error(res.data.message);
        return;
      }

      if (currState === 'Forgot') {
        if (!newPassword) return toast.error("Enter new password");
        const res = await axios.post('/api/otp/forgot-password-verify', {
          email,
          otp,
          newPassword,
        });
        if (res.data.success) {
          toast.success("Password reset successful! Please login again.");
          setCurrState('Login');
          setStep('credentials');
          setPassword('');
          setNewPassword('');
          setOtp('');
        } else toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Verification failed");
    }
  };

  /* ------------------ OTP INPUT HANDLER ------------------ */
  const handleOtpChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return; // Only numbers
    const otpArray = otp.split('');
    otpArray[index] = value;
    const newOtp = otpArray.join('');
    setOtp(newOtp);

    if (value && index < 5) otpRefs.current[index + 1].focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  return (
    <section className='absolute top-0 left-0 h-full w-full z-50 bg-white'>
      <div className='flex h-full w-full'>
        <div className='w-1/2 hidden sm:block'>
          <img src={loginImg} alt="Login" className='object-cover aspect-square h-full w-full' />
        </div>
        <div className='flex w-full sm:w-1/2 items-center justify-center'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='flex flex-col items-center w-[90%] sm:max-w-md m-auto gap-y-5 text-gray-800'
          >
            <h3 className='bold-36'>{currState}</h3>

            {/* STEP: CREDENTIALS */}
            {step === 'credentials' && (
              <>
                {currState === 'Sign Up' && (
                  <input
                    type="text"
                    placeholder='Name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className='w-full px-3 py-1 ring-1 ring-slate-900/10 rounded bg-primary mt-1'
                  />
                )}
                <input
                  type="email"
                  placeholder='Email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='w-full px-3 py-1 ring-1 ring-slate-900/10 rounded bg-primary mt-1'
                />
                {(currState === 'Login' || currState === 'Sign Up') && (
                  <input
                    type="password"
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='w-full px-3 py-1 ring-1 ring-slate-900/10 rounded bg-primary mt-1'
                  />
                )}
              </>
            )}

            {/* STEP: OTP */}
            {step === 'otp' && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center gap-y-5 w-full"
              >
                <div className="flex justify-center gap-x-2">
                  {[...Array(6)].map((_, i) => (
                    <motion.input
                      key={i}
                      ref={(el) => (otpRefs.current[i] = el)}
                      type="text"
                      maxLength={1}
                      value={otp[i] || ''}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-10 h-10 text-center text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      whileFocus={{ scale: 1.1 }}
                    />
                  ))}
                </div>

                {currState === 'Forgot' && (
                  <input
                    type="password"
                    placeholder='Enter new password'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className='w-full px-3 py-1 ring-1 ring-slate-900/10 rounded bg-primary'
                  />
                )}
              </motion.div>
            )}

            {/* BUTTON */}
            <button
              className='btn-dark w-full mt-5 !py-[7px] !rounded'
              onClick={step === 'credentials' ? handleRequest : handleOtpVerify}
            >
              {step === 'otp'
                ? currState === 'Forgot'
                  ? 'Reset Password'
                  : 'Verify OTP'
                : currState === 'Sign Up'
                  ? 'Send OTP & Sign Up'
                  : currState === 'Forgot'
                    ? 'Send Reset OTP'
                    : 'Login'}
            </button>

            {/* SWITCH STATES */}
            {step === 'credentials' && (
              <div className='w-full flex flex-col gap-y-3 medium-14'>
                {currState === 'Login' && (
                  <div
                    className='underline cursor-pointer'
                    onClick={() => { setCurrState('Forgot'); setStep('credentials'); }}
                  >
                    Forgot your password?
                  </div>
                )}
                {currState === 'Login' ? (
                  <div className='underline'>
                    Don’t have an account?
                    <span
                      onClick={() => { setCurrState('Sign Up'); setStep('credentials'); }}
                      className='cursor-pointer'
                    > Create account</span>
                  </div>
                ) : (
                  <div className='underline'>
                    Already have an account?
                    <span
                      onClick={() => { setCurrState('Login'); setStep('credentials'); }}
                      className='cursor-pointer'
                    > Login</span>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Login;