import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiChevronLeft, FiChevronRight, FiStar } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchWishlist, removeFromWishlist,} from '../../features/user/productSlice';
import { addToCart, fetchCart } from '../../features/user/cartSlice'; 

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    wishlist,
    wishlistStatus,
    wishlistError
  } = useSelector((state) => state.products);

  const { status: cartStatus } = useSelector((state) => state.cart);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(wishlist.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = wishlist.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  useEffect(() => {
    if (wishlistError) {
      toast.error(wishlistError);
    }
  }, [wishlistError]);

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await dispatch(removeFromWishlist(productId)).unwrap();
      if (currentItems.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      dispatch(fetchWishlist());
    } catch (error) {
      toast.error(error.message || 'Failed to remove from wishlist');
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      const result = await dispatch(addToCart({ productId, quantity: 1 })).unwrap();
      if (result) {
        toast.success('Added to cart successfully');
        dispatch(fetchCart());
      }
    } catch (error) {
      toast.error(error.message || 'Failed to add to cart');
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FiStar key={i} className="text-yellow-400 fill-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FiStar key={i} className="text-yellow-400 fill-yellow-400" />);
      } else {
        stars.push(<FiStar key={i} className="text-gray-300" />);
      }
    }
    return stars;
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      } 
    },
    exit: { 
      opacity: 0, 
      x: -50, 
      transition: { 
        duration: 0.2,
        ease: "easeIn"
      } 
    }
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" },
    tap: { scale: 0.95 }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white py-8 px-4 md:px-8 shadow-sm">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center items-center mb-4"
          >
            <FiHeart className="text-red-500 text-3xl mr-3" />
            <h1 className="text-3xl font-bold">My Wishlist</h1>
          </motion.div>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-8 py-12">
        {wishlistStatus === 'loading' && wishlist.length === 0 ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        ) : wishlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16 bg-white rounded-xl shadow-sm"
          >
            <FiHeart className="text-gray-300 text-5xl mx-auto mb-4" />
            <h2 className="text-xl font-medium mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">Save your favorite jewellery pieces by clicking the heart icon</p>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="bg-black text-white px-6 py-3 rounded-lg font-medium"
              onClick={() => navigate('/products')}
            >
              Discover Beautiful jewellery
            </motion.button>
          </motion.div>
        ) : (
          <>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                Saved Items ({wishlist.length})
              </h2>
              <div className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentItems.map((item) => (
                  <motion.div
                    key={item._id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 relative border border-gray-100"
                  >
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromWishlist(item._id);
                      }}
                      className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                      aria-label="Remove from wishlist"
                      disabled={wishlistStatus === 'loading'}
                    >
                      <FiHeart className="text-red-500 fill-red-500" />
                    </motion.button>
                    
                    <div 
                      className="relative cursor-pointer" 
                      style={{ aspectRatio: '1/1' }}
                      onClick={() => navigate(`/ProductDetail/${item._id}`)}
                    >
                      <img 
                        src={`http://localhost:3000${encodeURI(item.defaultImage)}`}
                        crossOrigin="anonymous"
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1 line-clamp-1">{item.name}</h3>
                      
                      <div className="flex items-center mb-2">
                        <div className="flex mr-1">
                          {renderStars(item.rating || 0)}
                        </div>
                        <span className="text-xs text-gray-500">{item.rating || 0}</span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                      
                      <div className="text-sm text-gray-700 space-y-1 mb-4">
                        <p><span className="font-medium">Material:</span> {item.material}</p>
                        {item.size && <p><span className="font-medium">Size:</span> {item.size}</p>}
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div>
                          <span className="font-bold text-lg">₹{item.sellingPrice?.toFixed(2)}</span>
                          {item.mrp && item.mrp > item.sellingPrice && (
                            <span className="ml-2 text-sm text-gray-500 line-through">
                              ₹{item.mrp.toFixed(2)}
                            </span>
                          )}
                        </div>

                        <motion.button
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(item._id);
                          }}
                          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium"
                          disabled={cartStatus === 'loading'}
                        >
                          <FiShoppingCart /> 
                          {cartStatus === 'loading' ? 'Adding...' : 'Add to Cart'}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>

            {totalPages > 1 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex justify-center mt-12"
              >
                <nav className="flex items-center gap-2">
                  <motion.button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    whileTap={{ scale: 0.9 }}
                    className={`p-2 rounded-full ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-black hover:bg-gray-100'}`}
                    aria-label="Previous page"
                  >
                    <FiChevronLeft size={20} />
                  </motion.button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <motion.button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${currentPage === page ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                      aria-label={`Page ${page}`}
                    >
                      {page}
                    </motion.button>
                  ))}

                  <motion.button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    whileTap={{ scale: 0.9 }}
                    className={`p-2 rounded-full ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-black hover:bg-gray-100'}`}
                    aria-label="Next page"
                  >
                    <FiChevronRight size={20} />
                  </motion.button>
                </nav>
              </motion.div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Wishlist;