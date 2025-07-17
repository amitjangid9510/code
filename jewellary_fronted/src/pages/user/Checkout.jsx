import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';
import { ShoppingBag } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  fetchCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  updateQuantityLocally,
  completeItemUpdate
} from '../../features/user/cartSlice';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { 
    items, 
    total, 
    status, 
    error,
    updatingItems 
  } = useSelector((state) => state.cart);

  // const [addresses, setAddresses] = useState([
  //   {
  //     id: 1,
  //     name: "John Doe",
  //     street: "123 Main St",
  //     city: "New York",
  //     state: "NY",
  //     zip: "10001",
  //     country: "United States",
  //     isDefault: true,
  //     phone: "+1 (555) 123-4567"
  //   }
  // ]);

const addresses = useSelector((state) => state.auth.user.address);

const defaultAddress = addresses?.find(address => address.isDefault === true);



  const [selectedAddress, setSelectedAddress] = useState(1);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    phone: ''
  });
  const subtotal = items?.reduce((sum, item) => sum + (item.product?.sellingPrice * item.quantity), 0) || 0;
  const shipping = subtotal > 200 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const orderTotal = subtotal + shipping + tax;

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (!productId || newQuantity === undefined) {
      toast.error('Product ID and quantity are required');
      return;
    }

    const numericQuantity = Number(newQuantity);
    if (isNaN(numericQuantity)) {
      toast.error('Quantity must be a number');
      return;
    }

    if (numericQuantity < 1) {
      await handleRemoveItem(productId);
      return;
    }

    try {
      dispatch(updateQuantityLocally({ productId, quantity: numericQuantity }));
      const result = await dispatch(updateCartItem({ 
        productId: String(productId),
        quantity: numericQuantity
      }));

      if (result.error) {
        throw new Error(result.error.message);
      }
      dispatch(fetchCart());
    } catch (error) {
      toast.error(error.message || 'Failed to update quantity');
      dispatch(fetchCart());
    } finally {
      dispatch(completeItemUpdate({ productId }));
    }
  };

  const handleRemoveItem = async (productId) => {
    if (!productId) {
      toast.error('Product ID is required');
      return;
    }
    try {
      const result = await dispatch(removeCartItem(String(productId)));
      if (result.error) {
        throw new Error(result.error.message);
      }
      toast.success('Item removed from cart');
      dispatch(fetchCart());
    } catch (error) {
      toast.error(error.message || 'Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    try {
      const result = await dispatch(clearCart());
      if (result.error) {
        throw new Error(result.error.message);
      }
      toast.success('Cart cleared successfully');
      dispatch(fetchCart());
    } catch (error) {
      toast.error(error.message || 'Failed to clear cart');
    }
  };

  const handleProceedToPayment = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    if (!selectedAddress) {
      toast.error('Please select a shipping address');
      return;
    }
    navigate('/payment', {
      state: {
        items,
        shippingAddress: addresses.find(a => a.id === selectedAddress),
        total: orderTotal
      }
    });
  };

  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveAddress = () => {
    if (!newAddress.name || !newAddress.street || !newAddress.city || !newAddress.zip) {
      toast.error('Please fill all required address fields');
      return;
    }

    const newId = addresses.length > 0 ? Math.max(...addresses.map(a => a.id)) + 1 : 1;
    const addressToAdd = {
      id: newId,
      ...newAddress,
      isDefault: false
    };
    setAddresses([...addresses, addressToAdd]);
    setSelectedAddress(newId);
    setShowAddAddress(false);
    setNewAddress({
      name: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      phone: ''
    });
    toast.success('Address added successfully');
  };

  if (status === 'loading' && items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => dispatch(fetchCart())}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Retry Loading Cart
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-3xl font-bold mb-8 flex items-center">
          <ShoppingBag className="mr-2" /> Your Shopping Cart
        </h1>
        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-lg mb-4">Your cart is empty</p>
            <button
              onClick={() => navigate('/products')}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3 space-y-4">
              {items.map((item) => (
                <motion.div
                  key={item.product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg shadow overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-1/3 p-4">
                      <img
                        src={`http://localhost:3000${encodeURI(item?.product?.images?.[0])}`}
                        crossOrigin="anonymous"
                        alt={item?.product.name}
                        className="w-full h-48 object-contain"
                      />
                    </div>
                    <div className="sm:w-2/3 p-4 flex flex-col">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium">{item.product.name}</h3>
                          <p className="text-gray-600 mt-1">₹{item.product.sellingPrice?.toFixed(2)}</p>
                          {item.product.material && (
                            <p className="text-sm text-gray-500 mt-1">Material: {item.product.material}</p>
                          )}
                        </div>
                        <button 
                          onClick={() => handleRemoveItem(item.product._id)}
                          className="text-gray-500 hover:text-red-500 p-2"
                          disabled={updatingItems[item.product._id]}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                      <div className="mt-auto pt-4 flex items-center justify-between">
                        <div className="flex items-center border border-gray-200 rounded">
                          <button
                            onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                            className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
                            disabled={updatingItems[item.product._id] || item.quantity <= 1}
                          >
                            <FiMinus />
                          </button>
                          <span className="px-4">
                            {updatingItems[item.product._id] ? (
                              <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
                            ) : (
                              item.quantity
                            )}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                            className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
                            disabled={updatingItems[item.product._id]}
                          >
                            <FiPlus />
                          </button>
                        </div>
                        <div className="font-bold">
                          ₹{(item.product.sellingPrice * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              <div className="bg-white rounded-lg shadow p-4">
                <button
                  onClick={handleClearCart}
                  className="text-red-500 hover:text-red-700 flex items-center"
                  disabled={items.length === 0}
                >
                  <FiTrash2 className="mr-2" /> Clear Entire Cart
                </button>
              </div>
            </div>
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow p-6 sticky top-8">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal ({items.length} items)</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{orderTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold">Shipping Address</h3>
                    <button 
                      onClick={() => setShowAddAddress(true)}
                      className="text-sm flex items-center text-gray-600 hover:text-black"
                    >
                      <FiPlus className="mr-1" /> Add New
                    </button>
                  </div>
                  
                  {showAddAddress ? (
                    <div className="border border-gray-200 rounded-lg p-4 mb-4">
                      <h4 className="font-medium mb-3">Add New Address</h4>
                      <div className="space-y-3">
                        <input 
                          type="text" 
                          name="name"
                          placeholder="Full Name *" 
                          className="w-full border border-gray-300 rounded px-3 py-2"
                          value={newAddress.name}
                          onChange={handleAddressInputChange}
                          required
                        />
                        <input 
                          type="text" 
                          name="street"
                          placeholder="Street Address *" 
                          className="w-full border border-gray-300 rounded px-3 py-2"
                          value={newAddress.street}
                          onChange={handleAddressInputChange}
                          required
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input 
                            type="text" 
                            name="city"
                            placeholder="City *" 
                            className="border border-gray-300 rounded px-3 py-2"
                            value={newAddress.city}
                            onChange={handleAddressInputChange}
                            required
                          />
                          <input 
                            type="text" 
                            name="state"
                            placeholder="State/Province *" 
                            className="border border-gray-300 rounded px-3 py-2"
                            value={newAddress.state}
                            onChange={handleAddressInputChange}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <input 
                            type="text" 
                            name="zip"
                            placeholder="ZIP/Postal Code *" 
                            className="border border-gray-300 rounded px-3 py-2"
                            value={newAddress.zip}
                            onChange={handleAddressInputChange}
                            required
                          />
                          <input 
                            type="text" 
                            name="country"
                            placeholder="Country *" 
                            className="border border-gray-300 rounded px-3 py-2"
                            value={newAddress.country}
                            onChange={handleAddressInputChange}
                            required
                          />
                        </div>
                        <input 
                          type="tel" 
                          name="phone"
                          placeholder="Phone Number" 
                          className="w-full border border-gray-300 rounded px-3 py-2"
                          value={newAddress.phone}
                          onChange={handleAddressInputChange}
                        />
                      </div>
                      <div className="flex justify-end space-x-3 mt-4">
                        <button 
                          onClick={() => setShowAddAddress(false)}
                          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={handleSaveAddress}
                          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                          disabled={!newAddress.name || !newAddress.street || !newAddress.city || !newAddress.zip}
                        >
                          Save Address
                        </button>
                      </div>
                    </div>
                  ) : (
                      <div className="space-y-4">
                        {defaultAddress && (
                          <div 
                            key={defaultAddress._id}
                            onClick={() => setSelectedAddress(defaultAddress._id)}
                            className={`border rounded-lg p-4 cursor-pointer ${
                              selectedAddress === defaultAddress._id ? 'border-black' : 'border-gray-200'
                            }`}
                          >
                            <div className="flex justify-between">
                              <h4 className="font-medium">{defaultAddress.fullName}</h4>
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded">Default</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{defaultAddress.streetAddress}</p>
                            <p className="text-sm text-gray-600">{defaultAddress.city}, {defaultAddress.state} {defaultAddress.zip}</p>
                            <p className="text-sm text-gray-600">India</p>
                            {defaultAddress.phone && (
                              <p className="text-sm text-gray-600 mt-1">{defaultAddress.phone}</p>
                            )}
                          </div>
                        )}
                      </div>
                  )}
                </div>

                <button
                  onClick={handleProceedToPayment}
                  className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50"
                  disabled={items.length === 0 || !selectedAddress}
                >
                  Proceed to Payment
                </button>

                <p className="text-xs text-gray-500 mt-4 text-center">
                  By placing your order, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;