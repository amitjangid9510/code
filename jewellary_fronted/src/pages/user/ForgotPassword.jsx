import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden"
      >
        <div className="bg-primary-DEFAULT p-6 text-center">
          <h2 className="text-2xl font-bold text-white">Reset Password</h2>
        </div>
        
        <div className="p-8">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6">
                <p>Password reset link has been sent to your email.</p>
              </div>
              <Link
                to="/login"
                className="inline-flex items-center text-primary-DEFAULT font-medium hover:text-primary-dark"
              >
                <ArrowLeft className="mr-1" />
                Back to login
              </Link>
            </motion.div>
          ) : (
            <>
              <p className="text-gray-600 mb-6">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 mb-2">Email Address</label>
                  <div className={`flex items-center border rounded-lg px-3 py-2 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}>
                    <Mail className="text-gray-400 mr-2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full focus:outline-none"
                      placeholder="your@email.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-primary-DEFAULT text-white py-3 px-4 rounded-lg font-bold hover:bg-primary-dark transition-colors"
                >
                  Send Reset Link
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="text-primary-DEFAULT font-medium hover:text-primary-dark flex items-center justify-center"
                >
                  <ArrowLeft className="mr-1" />
                  Back to login
                </Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;