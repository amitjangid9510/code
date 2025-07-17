import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiShare2, FiHeart, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchProducts, 
  setPage,
  addToWishlist,
  removeFromWishlist,
  fetchWishlist,
  toggleProductFavorite
} from '../../features/user/productSlice';
import { addToCart } from '../../features/user/cartSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Products = () => {
  const dispatch = useDispatch();
  const {
    data: products,
    status,
    error,
    page,
    totalPages,
    totalProducts,
    filters,
    wishlist,
    wishlistStatus
  } = useSelector((state) => state.products);

  const { status: cartStatus } = useSelector((state) => state.cart);
  const productsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchProducts({ page, limit: productsPerPage, search: filters.search || '', filters }));
    dispatch(fetchWishlist());
  }, [dispatch, page, filters]);

  const paginate = (pageNumber) => dispatch(setPage(pageNumber));
  const nextPage = () => {
    if (page < totalPages) {
      dispatch(setPage(page + 1));
    }
  };
  const prevPage = () => {
    if (page > 1) {
      dispatch(setPage(page - 1));
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await dispatch(addToCart({ productId })).unwrap();
      toast.success('Product added to cart successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to add product to cart');
    }
  };

  const toggleWishlist = async (productId) => {
    const product = products.find(p => p._id === productId);
    const isFavorite = product?.isFavorite;
    dispatch(toggleProductFavorite({ productId, isFavorite: !isFavorite }));
    try {
      if (isFavorite) {
        await dispatch(removeFromWishlist(productId)).unwrap();
        toast.success('Removed from wishlist');
      } else {
        await dispatch(addToWishlist(productId)).unwrap();
        toast.success('Added to wishlist');
      }
      dispatch(fetchWishlist());
    } catch (error) {
      dispatch(toggleProductFavorite({ productId, isFavorite }));
      toast.error(error.message || 'Failed to update wishlist');
    }
  };

  const shareProduct = async (product) => {
    const productUrl = `${window.location.origin}/ProductDetail/${product._id}`;
    const shareText = `Check out ${product.name} for ₹${product.sellingPrice}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: shareText,
          url: productUrl,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${shareText}: ${productUrl}`);
        toast.info('Product link copied to clipboard!');
      } else {
        window.open(`mailto:?subject=${encodeURIComponent(product.name)}&body=${encodeURIComponent(`${shareText}\n${productUrl}`)}`);
      }
    } catch (err) {
      console.error('Error sharing:', err);
      if (!navigator.share) {
        window.open(`mailto:?subject=${encodeURIComponent(product.name)}&body=${encodeURIComponent(`${shareText}\n${productUrl}`)}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto py-8 px-4">

        {status === 'loading' && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-6">
          <p className="text-gray-600">
            Showing {products.length} of {totalProducts} {totalProducts === 1 ? 'result' : 'results'} 
            {filters.search && ` for "${filters.search}"`}
          </p>
        </div>

        {status !== 'loading' && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300 relative"
                >
                  <div
                   className="relative overflow-hidden h-48 bg-gray-100 cursor-pointer"
                   onClick={() => navigate(`/ProductDetail/${product._id}`)}
                  >
                    <img
                      src={`http://localhost:3000${encodeURI(product.defaultImage)}`}
                      crossOrigin="anonymous"
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product._id);
                      }}
                      disabled={wishlistStatus === 'loading'}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors disabled:opacity-50"
                      aria-label={product.isFavorite ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <FiHeart 
                        className={`${product.isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-600'} transition-colors`} 
                      />
                    </button>
                  </div>

                  <div className="p-4">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {product.category}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-800 mt-1 mb-2 cursor-pointer hover:text-black hover:underline transition-colors"
                       onClick={() => navigate(`/ProductDetail/${product._id}`)}
                    >
                      {product.name}
                    </h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xl font-bold text-black">
                        ₹{product.sellingPrice}
                      </span>
                      {product.discount > 0 && (
                        <>
                          <span className="text-sm text-gray-500 line-through">
                            ₹{product.mrp}
                          </span>
                          <span className="text-sm text-green-600">
                            {product.discount}% off
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="text-sm text-gray-600">
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </div>
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            shareProduct(product);
                          }}
                          className="p-2 text-gray-600 hover:text-black transition-colors"
                          aria-label="Share product"
                        >
                          <FiShare2 />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product._id);
                          }}
                          disabled={cartStatus === 'loading' || product.stock <= 0}
                          className={`flex items-center px-4 py-2 rounded-full transition-colors ${
                            cartStatus === 'loading' || product.stock <= 0
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-black text-white hover:bg-gray-800'
                          }`}
                        >
                          <FiShoppingCart className="mr-2" />
                          {cartStatus === 'loading' ? 'Adding...' : 'Add to Cart'}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center space-x-2">
                  <motion.button
                    onClick={prevPage}
                    disabled={page === 1}
                    whileTap={{ scale: 0.95 }}
                    className={`p-2 rounded-full ${page === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-black hover:bg-gray-100'}`}
                    aria-label="Previous page"
                  >
                    <FiChevronLeft size={20} />
                  </motion.button>

                  {Array.from({ length: totalPages }, (_, index) => (
                    <motion.button
                      key={index}
                      onClick={() => paginate(index + 1)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${page === index + 1 ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                      aria-label={`Go to page ${index + 1}`}
                    >
                      {index + 1}
                    </motion.button>
                  ))}

                  <motion.button
                    onClick={nextPage}
                    disabled={page === totalPages}
                    whileTap={{ scale: 0.95 }}
                    className={`p-2 rounded-full ${page === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-black hover:bg-gray-100'}`}
                    aria-label="Next page"
                  >
                    <FiChevronRight size={20} />
                  </motion.button>
                </nav>
              </div>
            )}
          </>
        )}

        {status !== 'loading' && !error && products.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No products found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Products;