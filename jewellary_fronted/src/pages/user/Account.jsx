import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit, FiPlus, FiEye, FiEyeOff, FiCheck, FiX } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { passwordSchema, addressSchema } from '../../validation/YupSchema';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../features/auth/authSlice';

const Account = () => {
  const dispatch = useDispatch();
  const { user, error: authError } = useSelector((state) => state.auth);
  
  const [profile, setProfile] = useState({
    name: user?.name,
    email: user?.email,
    phone: user?.phone,
    age: user?.age,
    gender: user?.gender,
    jewelleryInterests: user?.jewelleryInterests || []
  });

 const [addresses, setAddresses] = useState(user?.address || []);
 const [editingAddressId, setEditingAddressId] = useState(null);

  function getPasswordChangedAgo(dateString) {
    if (!dateString) return 'Never changed';

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) return 'just now';
    if (minutes === 1) return '1 minute ago';
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    if (days === 1) return '1 day ago';
    if (days < 30) return `${days} days ago`;
    if (months === 1) return '1 month ago';
    if (months < 12) return `${months} months ago`;
    if (years === 1) return '1 year ago';
    return `${years} years ago`;
  }

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showInterestsDropdown, setShowInterestsDropdown] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isUpdatingInterests, setIsUpdatingInterests] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        age: user.age || prev.age,
        gender: user.gender || prev.gender,
        jewelleryInterests: user.jewelleryInterests || prev.jewelleryInterests
      }));
      setAddresses(user.address || []);
    }
  }, [user]);

  useEffect(() => {
    if (authError) {
      setApiError(authError);
    }
  }, [authError]);

  useEffect(() => {
    if (apiError || successMessage) {
      const timer = setTimeout(() => {
        setApiError(null);
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [apiError, successMessage]);

  const { 
    register: registerPassword, 
    handleSubmit: handlePasswordSubmit, 
    formState: { errors: passwordErrors },
    reset: resetPasswordForm
  } = useForm({
    resolver: yupResolver(passwordSchema)
  });

  const { 
    register: registerAddress, 
    handleSubmit: handleAddressSubmit, 
    formState: { errors: addressErrors },
    reset: resetAddressForm
  } = useForm({
    resolver: yupResolver(addressSchema)
  });

  const startEditing = (field, value) => {
    setEditingField(field);
    setTempValue(value);
    setApiError(null);
    setSuccessMessage(null);
  };

  const saveEdit = async () => {
    try {
      await dispatch(updateUser({ [editingField]: tempValue })).unwrap();
      setProfile({ ...profile, [editingField]: tempValue });
      setEditingField(null);
      setSuccessMessage(`${editingField.charAt(0).toUpperCase() + editingField.slice(1)} updated successfully!`);
    } catch (error) {
      setApiError(error.message || 'Failed to update profile');
    }
  };

  const cancelEdit = () => {
    setEditingField(null);
    setApiError(null);
  };

  const submitPasswordChange = async (data) => {
    try {
      await dispatch(updateUser({ password: data.newPassword })).unwrap();
      setShowPasswordForm(false);
      resetPasswordForm();
      setSuccessMessage('Password updated successfully!');
    } catch (error) {
      setApiError(error.message || 'Failed to update password');
    }
  };

  const toggleInterest = async (interest) => {
    try {
      setIsUpdatingInterests(true);
      
      const updatedInterests = profile.jewelleryInterests.includes(interest)
        ? profile.jewelleryInterests.filter(i => i !== interest)
        : [...profile.jewelleryInterests, interest];

      setProfile({
        ...profile,
        jewelleryInterests: updatedInterests
      });

      await dispatch(updateUser({ jewelleryInterests: updatedInterests })).unwrap();

      setSuccessMessage('jewellery Interests updated successfully!');
    } catch (error) {
      setProfile({
        ...profile,
        jewelleryInterests: profile.jewelleryInterests
      });
      
      setApiError(error.message || 'Failed to update jewellery Interests');
    } finally {
      setIsUpdatingInterests(false);
    }
  };

  const addNewAddress = async (data) => {
    try {
      const addressData = {
        address: {
          ...data,
          action: 'add'
        }
      };
      
      const updatedUser = await dispatch(updateUser(addressData)).unwrap();
      setAddresses(updatedUser.address);
      resetAddressForm();
      setShowAddressForm(false);
      setSuccessMessage('Address added successfully!');
    } catch (error) {
      setApiError(error.message || 'Failed to add address');
    }
  };

  const updateAddress = async (addressId, data) => {
    try {
      const addressData = {
        address: {
          ...data,
          _id: addressId,
          action: 'update'
        }
      };
      
      const updatedUser = await dispatch(updateUser(addressData)).unwrap();
      setAddresses(updatedUser.address);
      setEditingAddressId(null);
      setShowAddressForm(false);
      resetAddressForm();
      setSuccessMessage('Address updated successfully!');
    } catch (error) {
      setApiError(error.message || 'Failed to update address');
    }
  };

  const setDefaultAddress = async (addressId) => {
    try {
      const addressToUpdate = addresses.find(a => a._id === addressId);
      if (!addressToUpdate) return;
      
      const addressData = {
        address: {
          ...addressToUpdate,
          _id: addressId,
          isDefault: true,
          action: 'update'
        }
      };
      
      const updatedUser = await dispatch(updateUser(addressData)).unwrap();
      setAddresses(updatedUser.address);
      setSuccessMessage('Default address updated successfully!');
    } catch (error) {
      setApiError(error.message || 'Failed to set default address');
    }
  };

  const removeAddress = async (addressId) => {
    try {
      if (addresses.length <= 1 || addresses.find(a => a._id === addressId)?.isDefault) {
        setApiError('Cannot remove the only address or default address');
        return;
      }
      
      const addressData = {
        address: {
          _id: addressId,
          action: 'delete'
        }
      };
      
      const updatedUser = await dispatch(updateUser(addressData)).unwrap();
      setAddresses(updatedUser.address);
      setSuccessMessage('Address removed successfully!');
    } catch (error) {
      setApiError(error.message || 'Failed to remove address');
    }
  };

  const jewelryCategories = [
    'Rings', 'Necklaces', 'Earrings', 'Bracelets', 
    'Watches', 'Brooches', 'Anklets', 'Cufflinks'
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="container mx-auto px-4 py-8">
        <AnimatePresence>
          {apiError && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded relative"
            >
              <div className="flex items-center">
                <FiX className="mr-2" />
                <span>{authError?.message|| 'An unknown error occurred'}</span>
                <button
                  onClick={() => setApiError(null)}
                  className="ml-auto text-red-700 hover:text-red-900"
                >
                  <FiX size={18} />
                </button>
              </div>
            </motion.div>
          )}
          
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded relative"
            >
              <div className="flex items-center">
                <FiCheck className="mr-2" />
                <span>{successMessage}</span>
                <button
                  onClick={() => setSuccessMessage(null)}
                  className="ml-auto text-green-700 hover:text-green-900"
                >
                  <FiX size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
          <p className="text-gray-600">Manage your personal information, addresses, and preferences</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Personal Information</h2>
              </div>

              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      {editingField === 'name' ? (
                        <div className="flex items-center mt-1">
                          <input
                            type="text"
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            className="border-b border-gray-300 focus:border-black outline-none flex-1"
                          />
                          <button onClick={saveEdit} className="ml-2 text-black">
                            <FiCheck />
                          </button>
                          <button onClick={cancelEdit} className="ml-1 text-gray-500">
                            ×
                          </button>
                        </div>
                      ) : (
                        <p className="font-medium mt-1">
                          {profile.name}
                          <button 
                            onClick={() => startEditing('name', profile.name)}
                            className="ml-2 text-gray-400 hover:text-black"
                          >
                            <FiEdit size={16} />
                          </button>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-b border-gray-100 pb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Email Address</p>
                      {editingField === 'email' ? (
                        <div className="flex items-center mt-1">
                          <input
                            type="email"
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            className="border-b border-gray-300 focus:border-black outline-none flex-1"
                          />
                          <button onClick={saveEdit} className="ml-2 text-black">
                            <FiCheck />
                          </button>
                          <button onClick={cancelEdit} className="ml-1 text-gray-500">
                            ×
                          </button>
                        </div>
                      ) : (
                        <p className="font-medium mt-1">
                          {profile.email}
                          <button 
                            onClick={() => startEditing('email', profile.email)}
                            className="ml-2 text-gray-400 hover:text-black"
                          >
                            <FiEdit size={16} />
                          </button>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-b border-gray-100 pb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      {editingField === 'phone' ? (
                        <div className="flex items-center mt-1">
                          <input
                            type="tel"
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            className="border-b border-gray-300 focus:border-black outline-none flex-1"
                          />
                          <button onClick={saveEdit} className="ml-2 text-black">
                            <FiCheck />
                          </button>
                          <button onClick={cancelEdit} className="ml-1 text-gray-500">
                            ×
                          </button>
                        </div>
                      ) : (
                        <p className="font-medium mt-1">
                          {profile.phone}
                          <button 
                            onClick={() => startEditing('phone', profile.phone)}
                            className="ml-2 text-gray-400 hover:text-black"
                          >
                            <FiEdit size={16} />
                          </button>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-b border-gray-100 pb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Age</p>
                      {editingField === 'age' ? (
                        <div className="flex items-center mt-1">
                          <input
                            type="number"
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            className="border-b border-gray-300 focus:border-black outline-none flex-1"
                            min="18"
                            max="120"
                          />
                          <button onClick={saveEdit} className="ml-2 text-black">
                            <FiCheck />
                          </button>
                          <button onClick={cancelEdit} className="ml-1 text-gray-500">
                            ×
                          </button>
                        </div>
                      ) : (
                        <p className="font-medium mt-1">
                          {profile.age || 'Not specified'}
                          <button 
                            onClick={() => startEditing('age', profile.age)}
                            className="ml-2 text-gray-400 hover:text-black"
                          >
                            <FiEdit size={16} />
                          </button>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-b border-gray-100 pb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Gender</p>
                      {editingField === 'gender' ? (
                        <div className="flex items-center mt-1 space-x-4">
                          <select
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            className="border-b border-gray-300 focus:border-black outline-none flex-1"
                          >
                            <option value="">Select gender</option>
                            <option value="Men">Men</option>
                            <option value="Women">Women</option>
                            <option value="Unisex">Unisex</option>
                          </select>
                          <button onClick={saveEdit} className="ml-2 text-black">
                            <FiCheck />
                          </button>
                          <button onClick={cancelEdit} className="ml-1 text-gray-500">
                            ×
                          </button>
                        </div>
                      ) : (
                        <p className="font-medium mt-1">
                          {profile.gender || 'Not specified'}
                          <button 
                            onClick={() => startEditing('gender', profile.gender)}
                            className="ml-2 text-gray-400 hover:text-black"
                          >
                            <FiEdit size={16} />
                          </button>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Jewellery Interests</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {profile.jewelleryInterests.map(interest => (
                          <span 
                            key={interest}
                            className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center"
                          >
                            {interest}
                            <button 
                              onClick={() => toggleInterest(interest)}
                              className="ml-1 text-gray-500 hover:text-black"
                              disabled={isUpdatingInterests}
                            >
                              {isUpdatingInterests ? '...' : '×'}
                            </button>
                          </span>
                        ))}
                        <div className="relative">
                          <button 
                            onClick={() => setShowInterestsDropdown(!showInterestsDropdown)}
                            className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center"
                            disabled={isUpdatingInterests}
                          >
                            <FiPlus size={14} className="mr-1" />
                            {isUpdatingInterests ? 'Updating...' : 'Add'}
                          </button>
                          
                          <AnimatePresence>
                            {showInterestsDropdown && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200"
                              >
                                <div className="py-1 max-h-60 overflow-auto">
                                  {jewelryCategories
                                    .filter(cat => !profile.jewelleryInterests.includes(cat))
                                    .map(category => (
                                      <button
                                        key={category}
                                        onClick={() => {
                                          toggleInterest(category);
                                          setShowInterestsDropdown(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                        disabled={isUpdatingInterests}
                                      >
                                        {category}
                                      </button>
                                    ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Password</h2>
                {!showPasswordForm && (
                  <button 
                    onClick={() => setShowPasswordForm(true)}
                    className="text-sm text-black hover:underline"
                  >
                    Change Password
                  </button>
                )}
              </div>

              {showPasswordForm ? (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handlePasswordSubmit(submitPasswordChange)}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        {...registerPassword('newPassword')}
                        className="w-full border-b border-gray-300 focus:border-black outline-none py-1 pr-8"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black"
                      >
                        {showNewPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                    {passwordErrors.newPassword && (
                      <p className="text-red-500 text-xs mt-1">{passwordErrors.newPassword.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        {...registerPassword('confirmPassword')}
                        className="w-full border-b border-gray-300 focus:border-black outline-none py-1 pr-8"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-black"
                      >
                        {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                    {passwordErrors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">{passwordErrors.confirmPassword.message}</p>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordForm(false);
                        resetPasswordForm();
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                    >
                      Save Changes
                    </button>
                  </div>
                </motion.form>
              ) : (
                <p className="text-gray-500">{`Password was last changed ${getPasswordChangedAgo(user.passwordChangedAt)}`}</p>
              )}
            </motion.div>
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 sticky top-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Addresses</h2>
                {!showAddressForm && (
                  <button 
                    onClick={() => setShowAddressForm(true)}
                    className="text-sm text-black hover:underline flex items-center"
                  >
                    <FiPlus className="mr-1" /> Add New
                  </button>
                )}
              </div>

              {showAddressForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6"
                >
                  <h3 className="font-medium mb-4">
                    {editingAddressId ? 'Edit Address' : 'Add New Address'}
                  </h3>
                  <form 
                    onSubmit={handleAddressSubmit((data) => {
                      if (editingAddressId) {
                        updateAddress(editingAddressId, data);
                      } else {
                        addNewAddress(data);
                      }
                    })} 
                    className="space-y-3"
                  >
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Full Name</label>
                      <input
                        type="text"
                        {...registerAddress('fullName')}
                        className="w-full border-b border-gray-300 focus:border-black outline-none py-1"
                      />
                      {addressErrors.fullName && (
                        <p className="text-red-500 text-xs mt-1">{addressErrors.fullName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Street Address</label>
                      <input
                        type="text"
                        {...registerAddress('streetAddress')}
                        className="w-full border-b border-gray-300 focus:border-black outline-none py-1"
                      />
                      {addressErrors.streetAddress && (
                        <p className="text-red-500 text-xs mt-1">{addressErrors.streetAddress.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">City</label>
                        <input
                          type="text"
                          {...registerAddress('city')}
                          className="w-full border-b border-gray-300 focus:border-black outline-none py-1"
                        />
                        {addressErrors.city && (
                          <p className="text-red-500 text-xs mt-1">{addressErrors.city.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">State</label>
                        <input
                          type="text"
                          {...registerAddress('state')}
                          className="w-full border-b border-gray-300 focus:border-black outline-none py-1"
                        />
                        {addressErrors.state && (
                          <p className="text-red-500 text-xs mt-1">{addressErrors.state.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">ZIP Code</label>
                        <input
                          type="text"
                          {...registerAddress('zip')}
                          className="w-full border-b border-gray-300 focus:border-black outline-none py-1"
                        />
                        {addressErrors.zip && (
                          <p className="text-red-500 text-xs mt-1">{addressErrors.zip.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">Country</label>
                        <input
                          type="text"
                          {...registerAddress('country')}
                          className="w-full border-b border-gray-300 focus:border-black outline-none py-1"
                        />
                        {addressErrors.country && (
                          <p className="text-red-500 text-xs mt-1">{addressErrors.country.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-500 mb-1">Phone Number</label>
                      <input
                        type="text"
                        {...registerAddress('phone')}
                        className="w-full border-b border-gray-300 focus:border-black outline-none py-1"
                      />
                      {addressErrors.phone && (
                        <p className="text-red-500 text-xs mt-1">{addressErrors.phone.message}</p>
                      )}
                    </div>

                    <div className="flex items-center pt-2">
                      <input
                        type="checkbox"
                        id="defaultAddress"
                        {...registerAddress('isDefault')}
                        className="mr-2"
                      />
                      <label htmlFor="defaultAddress" className="text-sm text-gray-700">
                        Set as default address
                      </label>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddressForm(false);
                          setEditingAddressId(null);
                          resetAddressForm();
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                      >
                        {editingAddressId ? 'Update Address' : 'Save Address'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              <div className="space-y-4">
                {addresses.map(address => (
                  <motion.div
                    key={address._id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`border rounded-lg p-4 ${address.isDefault ? 'border-black' : 'border-gray-200'}`}
                  >
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium">{address.fullName}</h4>
                        {address.isDefault && (
                          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded inline-block mt-1">Default</span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingAddressId(address._id);
                            setShowAddressForm(true);
                            resetAddressForm({
                              fullName: address.fullName,
                              streetAddress: address.streetAddress,
                              city: address.city,
                              state: address.state,
                              zip: address.zip,
                              country: address.country,
                              phone: address.phone,
                              isDefault: address.isDefault
                            });
                          }}
                          className="text-xs text-black hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDefaultAddress(address._id)}
                          disabled={address.isDefault}
                          className={`text-xs ${address.isDefault ? 'text-gray-400' : 'text-black hover:underline'}`}
                        >
                          {address.isDefault ? 'Default' : 'Set Default'}
                        </button>
                        <button
                          onClick={() => removeAddress(address._id)}
                          disabled={addresses.length <= 1 || address.isDefault}
                          className={`text-xs ${addresses.length <= 1 || address.isDefault ? 'text-gray-400' : 'text-red-500 hover:underline'}`}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{address.streetAddress}</p>
                    <p className="text-sm text-gray-600">{address.city}, {address.state} {address.zip}</p>
                    <p className="text-sm text-gray-600">{address.country}</p>
                    <p className="text-sm text-gray-600 mt-2">{address.phone}</p>
                  </motion.div>
                ))}
                
                {addresses.length === 0 && !showAddressForm && (
                  <div className="text-center py-4 text-gray-500">
                    <p>No addresses saved yet</p>
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="mt-2 text-black hover:underline flex items-center justify-center mx-auto"
                    >
                      <FiPlus className="mr-1" /> Add your first address
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;