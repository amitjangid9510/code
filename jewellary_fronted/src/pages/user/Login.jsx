import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../../validation/YupSchema';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

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

const SparklingButton = ({ loading, children, disabled }) => {
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
        disabled={disabled || loading}
        className={`w-full py-3 px-4 rounded-lg font-bold text-white bg-black hover:bg-gray-900 relative overflow-hidden transition-colors duration-300 ${
          (disabled || loading) ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Signing in...' : children}
        
        {!disabled && elements.map((element) => (
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

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    const result = await dispatch(loginUser(data));
    if (result.payload?.success) {
      navigate('/');
    }
  };

  return (
    <div className="h-[calc(100vh-72px)] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div 
          className="absolute inset-0 bg-[url('/9653f6102b68c96dd8f59808b3ceed9d.jpg')] bg-cover bg-center animate-moveBackground"
          style={{
            animation: 'moveBackground 60s linear infinite',
            filter: 'blur(2px)',
            transform: 'scale(1.1)',
          }}
        ></div>
      </div>

      <style>{`
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
        className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden relative z-10"
      >
        <div className="bg-primary-DEFAULT p-6 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Sign In</h2>
        </div>
        
        <div className="p-8">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center bg-red-100 text-red-700 px-4 py-3 rounded mb-4"
            >
              <AlertCircle className="mr-2" />
              {error.message || 'Invalid credentials'}
            </motion.div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <div className={`flex items-center border rounded-lg px-3 py-2 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}>
                <Mail className="text-gray-400 mr-2" />
                <input
                  type="email"
                  {...register('email')}
                  className="w-full focus:outline-none"
                  placeholder="your@email.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Password</label>
              <div className={`flex items-center border rounded-lg px-3 py-2 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}>
                <Lock className="text-gray-400 mr-2" />
                <input
                  type="password"
                  {...register('password')}
                  className="w-full focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-DEFAULT focus:ring-primary-DEFAULT border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              
              <Link
                to="/forgot-password"
                className="text-sm text-primary-DEFAULT hover:text-primary-dark"
              >
                Forgot password?
              </Link>
            </div>
            
            <SparklingButton 
              loading={loading} 
              disabled={errors.email || errors.password}
            >
              Sign In
            </SparklingButton>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-primary-DEFAULT font-medium hover:text-primary-dark"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;