import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { signupSchema } from '../../validation/YupSchema';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser, verifySignUpOtp } from '../../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const FloatingDiamond = ({ size, left, delay, duration }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ 
        opacity: [0, 1, 0],
        y: -10,
        x: [0, Math.random() * 10 - 5]
      }}
      transition={{ 
        delay,
        duration,
        repeat: Infinity,
        repeatDelay: Math.random() * 3 + 1
      }}
      style={{
        position: "absolute",
        left: `${left}%`,
        width: `${size}px`,
        height: `${size}px`,
        background: "white",
        clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
        transform: "rotate(45deg)",
        filter: "drop-shadow(0 0 2px rgba(255, 255, 255, 0.8))"
      }}
    />
  );
};

const FloatingStar = ({ size, left, delay, duration }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ 
        opacity: [0, 1, 0],
        scale: [0.5, 1.2, 0.5],
        y: -15
      }}
      transition={{ 
        delay,
        duration,
        repeat: Infinity,
        repeatDelay: Math.random() * 2 + 1
      }}
      style={{
        position: "absolute",
        left: `${left}%`,
        width: `${size}px`,
        height: `${size}px`,
        background: "white",
        clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
        filter: "drop-shadow(0 0 2px rgba(255, 255, 255, 0.8))"
      }}
    />
  );
};

const SparklingButton = ({ loading, children }) => {
  const [elements, setElements] = useState([]);

  useEffect(() => {
    const newElements = [];
    for (let i = 0; i < 8; i++) {
      newElements.push({
        id: i,
        size: Math.random() * 32 + 2,
        left: Math.random() * 80 + 10,
        delay: Math.random() * 2,
        duration: Math.random() * 2 + 1,
        type: Math.random() > 0.5 ? "diamond" : "star"
      });
    }
    setElements(newElements);
  }, []);

  return (
    <div className="relative">
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 px-4 text-sm font-medium rounded-md text-white bg-black hover:bg-gray-900 relative overflow-hidden ${
          loading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Creating account...' : children}
        
        {elements.map((element) => (
          element.type === "diamond" ? (
            <FloatingDiamond
              key={element.id}
              size={element.size}
              left={element.left}
              delay={element.delay}
              duration={element.duration}
            />
          ) : (
            <FloatingStar
              key={element.id}
              size={element.size}
              left={element.left}
              delay={element.delay}
              duration={element.duration}
            />
          )
        ))}
      </button>
    </div>
  );
};

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userPhone, setUserPhone] = useState('');
  const { loading, error, signupMessage } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(300);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  const { 
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signupSchema),
  });

  useEffect(() => {
    if (!isOpen || timeLeft <= 0) {
      setIsResendDisabled(false);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, isOpen]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const onSubmit = async (data) => {
    setUserPhone(data.phone);
    const result = await dispatch(signupUser(data));
    if (result.payload?.success) {
      setIsOpen(true);
      setTimeLeft(300);
      setIsResendDisabled(true);
    }
  };

  const handleVerifySignUpOtp = async () => {
    const result = await dispatch(verifySignUpOtp({ phone: userPhone, otp }));
    if (result.payload?.success) {
      setIsOpen(false);
      navigate('/'); 
    }
  };

  const handleResendOtp = async () => {
    // const result = await dispatch(resendOtp({ phone: userPhone }));
    // if (result.payload?.success) {
    //   setTimeLeft(300);
    //   setIsResendDisabled(true);
    // }
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="h-[calc(100vh-64px)] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div 
          className="absolute inset-0 bg-[url('/9653f6102b68c96dd8f59808b3ceed9d.jpg')] bg-cover bg-center animate-moveBackground"
          style={{
            animation: 'moveBackground 60s linear infinite',
            filter: 'blur(2px)',
            transform: 'none',
          }}
        ></div>
      </div>

      <style jsx>{`
        @keyframes moveBackground {
          0% {
            background-position: 0% 0%;
          }
          50% {
            background-position: 100% 100%;
          }
          100% {
            background-position: 0% 0%;
          }
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-2xl relative z-10"
      >
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Create Account</h2>
          <p className="mt-2 text-sm text-gray-600">Join our futuristic jewellery community</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error.message || 'Registration failed'}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-4">
            <div>
              <input
                type="text"
                {...register('name')}
                placeholder="Name"
                className="w-full px-3 py-3 border rounded-lg focus:outline-none"
              />
              <p className="text-red-500 text-sm">{errors.name?.message}</p>
            </div>

            <div>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary">
                <span className="px-4 py-3 bg-gray-100 text-gray-700 text-sm font-medium select-none">+91</span>
                <input
                  type="tel"
                  id="phoneNumber"
                  {...register('phone')}
                  placeholder="Enter 10-digit mobile number"
                  className="w-full px-4 py-3 text-sm focus:outline-none"
                />
              </div>
              <p className="text-red-500 text-sm mt-1">{errors.phone?.message}</p>
            </div>

            <div>
              <input
                type="email"
                {...register('email')}
                placeholder="Email address"
                className="w-full px-3 py-3 border rounded-lg focus:outline-none"
              />
              <p className="text-red-500 text-sm">{errors.email?.message}</p>
            </div>

            <div>
              <input
                type="password"
                {...register('password')}
                placeholder="Password"
                className="w-full px-3 py-3 border rounded-lg focus:outline-none"
              />
              <p className="text-red-500 text-sm">{errors.password?.message}</p>
            </div>
          </div>

          <div>
            <SparklingButton loading={loading}>
              Sign up
            </SparklingButton>
          </div>
        </form>

        <div className="text-center text-sm">
          <span className="text-gray-600">Already have an account? </span>
          <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
            Sign in
          </Link>
        </div>
      </motion.div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => {}}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Verify Your Account
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {signupMessage || 'An OTP has been sent to your email/phone. Please enter it below to verify your account.'}
                    </p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className={`text-sm font-medium ${
                        timeLeft < 60 ? 'text-red-500' : 'text-gray-500'
                      }`}>
                        OTP expires in: {formatTime(timeLeft)}
                      </span>
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isResendDisabled}
                        className={`text-sm font-medium ${
                          isResendDisabled 
                            ? 'text-gray-400 cursor-not-allowed' 
                            : 'text-primary hover:text-primary-dark'
                        }`}
                      >
                        Resend OTP
                      </button>
                    </div>
                  </div>

                  <div className="mt-4">
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    {error && (
                      <p className="text-red-500 text-sm mt-1">
                        {error.message || 'Invalid OTP'}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                      onClick={handleVerifySignUpOtp}
                      disabled={loading}
                    >
                      {loading ? 'Verifying...' : 'Verify'}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Signup;