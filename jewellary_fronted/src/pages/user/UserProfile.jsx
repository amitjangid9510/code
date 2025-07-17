import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="bg-primary-DEFAULT p-6 text-white">
          <h1 className="text-2xl font-bold">My Account</h1>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-50 p-4 rounded-lg"
            >
              <h2 className="text-lg font-bold mb-4">Personal Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{user?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-50 p-4 rounded-lg"
            >
              <h2 className="text-lg font-bold mb-4">Order History</h2>
              <p className="text-gray-600">You haven't placed any orders yet.</p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfile;