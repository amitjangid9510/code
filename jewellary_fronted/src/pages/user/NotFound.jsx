import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="inline-flex items-center justify-center bg-red-100 text-red-600 rounded-full p-4 mb-6">
          <AlertTriangle size={48} />
        </div>
        <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center bg-primary-DEFAULT text-white font-medium py-2 px-6 rounded-lg hover:bg-primary-dark transition-colors"
        >
          <ArrowLeft className="mr-2" />
          Return Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;