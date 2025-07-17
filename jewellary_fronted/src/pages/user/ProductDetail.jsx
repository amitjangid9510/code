import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FacebookShareButton, TwitterShareButton, PinterestShareButton } from 'react-share';
import { FaHeart, FaRegHeart, FaStar, FaStarHalfAlt, FaRegStar, FaShare, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { FiShare2 } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { 
  clearSingleProduct, 
  fetchSingleProduct,
  addToWishlist,
  removeFromWishlist,
  fetchWishlist 
} from '../../features/user/productSlice';
import { addToCart } from '../../features/user/cartSlice';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { 
    singleProduct, 
    singleProductStatus, 
    singleProductError,
    wishlist,
    wishlistStatus,
    wishlistError
  } = useSelector((state) => state.products);

  const { status: cartStatus } = useSelector((state) => state.cart);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    dispatch(fetchSingleProduct(id));
    dispatch(fetchWishlist());
    
    return () => {
      dispatch(clearSingleProduct());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (singleProduct && wishlist) {
      setIsFavorite(wishlist.some(item => item._id === singleProduct._id));
    }
  }, [singleProduct, wishlist]);

  useEffect(() => {
    if (wishlistError) {
      toast.error(wishlistError);
    }
  }, [wishlistError]);

  const product = singleProduct;

  const similarProducts = [
    {
      id: 2,
      title: "Gold Plated Diamond Ring",
      price: 249.99,
      image: "https://images.unsplash.com/photo-1603974372035-96e2409a908d?w=300",
      rating: 4.2
    },
    {
      id: 3,
      title: "Silver Pearl Necklace",
      price: 189.99,
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300",
      rating: 4.7
    },
    {
      id: 4,
      title: "Diamond Stud Earrings",
      price: 159.99,
      image: "https://images.unsplash.com/photo-1605106702734-205df224ecce?w=300",
      rating: 4.4
    },
    {
      id: 5,
      title: "Rose Gold Bracelet",
      price: 179.99,
      image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=300",
      rating: 4.1
    }
  ];

  const handleQuantityChange = (value) => {
    const newQuantity = quantity + value;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await dispatch(addToCart({ 
        productId: product._id, 
        quantity: quantity 
      })).unwrap();
      toast.success('Added to cart successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to add to cart');
    }
  };

  const toggleFavorite = async () => {
    if (!product) return;
    try {
      if (isFavorite) {
        await dispatch(removeFromWishlist(product._id)).unwrap();
        toast.success('Removed from wishlist');
      } else {
        await dispatch(addToWishlist(product._id)).unwrap();
        toast.success('Added to wishlist');
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      toast.error(error.message || 'Failed to update wishlist');
    }
  };

  const shareUrl = `https://yourjewellerystore.com/products/${product?._id}`;
  const shareTitle = `Check out this beautiful ${product?.category} on jewellery Store`;

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-gray-700" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-gray-700" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-700" />);
      }
    }
    return stars;
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product?.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product?.images.length) % product?.images.length);
  };

  if (singleProductStatus === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (singleProductStatus === 'failed') {
    return <div className="min-h-screen flex items-center justify-center">Error: {singleProductError}</div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Product not found</div>;
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          <div className="lg:w-1/2">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative bg-gray-100 rounded-lg overflow-hidden mb-4"
              style={{ maxHeight: '500px' }}
            >
              <img 
                src={`http://localhost:3000${encodeURI(product?.images[selectedImage])}`}
                crossOrigin="anonymous"
                alt={product?.category} 
                className="w-full h-full object-contain p-8"
                style={{ maxHeight: '500px' }}
              />
              <button 
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition"
              >
                <FaChevronLeft />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition"
              >
                <FaChevronRight />
              </button>
            </motion.div>
            
            <div className="grid grid-cols-4 gap-2">
              {product?.images.map((img, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImage(index)}
                  className={`border rounded-lg overflow-hidden ${selectedImage === index ? 'border-gray-700' : 'border-gray-200'}`}
                  style={{ aspectRatio: '1/1' }}
                >
                  <img 
                    src={`http://localhost:3000${encodeURI(img)}`}
                    crossOrigin="anonymous"
                    alt={`${product?.category} thumbnail ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          </div>
          
          <div className="lg:w-1/2">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{product?.name}</h1>
              <div className="flex items-center mb-4">
                <div className="flex mr-2">
                  {renderStars(product?.rating)}
                </div>
                <span className="text-sm text-gray-600">{product?.rating} ({product?.reviewCount} reviews)</span>
              </div>
              
              <div className="mb-6">
                <span className="text-2xl font-bold">₹{product?.sellingPrice?.toFixed(2)}</span>
                {product?.originalPrice && (
                  <span className="ml-2 text-lg text-gray-500 line-through">₹{product.mrp.toFixed(2)}</span>
                )}
                {product?.mrp && (
                  <span className="ml-2 bg-gray-200 px-2 py-1 text-sm rounded">
                    {Math.round((1 - product?.sellingPrice / product?.mrp) * 100)}% OFF
                  </span>
                )}
              </div>
              
              <p className="mb-6 text-gray-700">{product?.description}</p>
              
              <div className="mb-6">
                <h3 className="font-medium mb-2">Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Material</p>
                    <p className="font-medium">{product?.material}</p>
                  </div>
                  {(product?.size) && 
                  <div>
                    <p className="text-sm text-gray-500">Size</p>
                    <p className="font-medium">{product?.size}</p>
                  </div>}
                  <div>
                    <p className="text-sm text-gray-500">Weight</p>
                    <p className="font-medium">{product?.weight} gm</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Availability</p>
                    <p className={`font-medium ${product?.stock ? 'text-green-600' : 'text-red-600'}`}>
                      {product?.stock ? 'In Stock' : 'Out of Stock'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center mb-6">
                <span className="mr-4 font-medium">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded">
                  <button 
                    onClick={() => handleQuantityChange(-1)}
                    className="px-3 py-1 text-lg hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-1">{quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(1)}
                    className="px-3 py-1 text-lg hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={cartStatus === 'loading' || !product?.stock}
                  className={`px-6 py-3 rounded-lg font-medium flex-1 min-w-[160px] ${
                    cartStatus === 'loading' || !product?.stock
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  {cartStatus === 'loading' ? 'Adding...' : 'Add to Cart'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white border border-black text-black px-6 py-3 rounded-lg font-medium flex-1 min-w-[160px]"
                >
                  Buy Now
                </motion.button>
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={toggleFavorite}
                  disabled={wishlistStatus === 'loading'}
                  className="flex items-center gap-2 text-gray-700 hover:text-black transition disabled:opacity-50"
                >
                  {isFavorite ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart />
                  )}
                  <span>{isFavorite ? 'Saved' : 'Save for later'}</span>
                </button>
                
                <div className="group relative flex items-center gap-2 text-gray-700 hover:text-black transition cursor-pointer">
                  <FiShare2 />
                  <span>Share</span>
                  <div className="hidden group-hover:flex absolute bottom-full left-0 bg-white shadow-lg p-2 rounded-lg z-10 space-x-2">
                    <FacebookShareButton url={shareUrl} quote={shareTitle}>
                      <span className="text-blue-600 text-sm">Facebook</span>
                    </FacebookShareButton>
                    <TwitterShareButton url={shareUrl} title={shareTitle}>
                      <span className="text-blue-400 text-sm">Twitter</span>
                    </TwitterShareButton>
                    <PinterestShareButton url={shareUrl} media={product?.images[0]} description={shareTitle}>
                      <span className="text-red-600 text-sm">Pinterest</span>
                    </PinterestShareButton>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        <div className="mb-16">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('description')}
                className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'description' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'reviews' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Reviews ({product?.reviewCount})
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'shipping' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Shipping & Returns
              </button>
            </nav>
          </div>
          
          <div className="py-8">
            {activeTab === 'description' && (
              <div>
                <h3 className="text-xl font-medium mb-4">Product Description</h3>
                <p className="text-gray-700">{product?.description}</p>
                <ul className="mt-4 list-disc pl-5 text-gray-700 space-y-2">
                  <li>Handcrafted by skilled artisans</li>
                  <li>Premium quality materials</li>
                  <li>Hypoallergenic and nickel-free</li>
                  <li>Comes in a beautiful gift box</li>
                  <li>30-day money-back guarantee</li>
                </ul>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-xl font-medium mb-4">Customer Reviews</h3>
                <div className="flex items-center mb-6">
                  <div className="text-4xl font-bold mr-4">{product?.rating}</div>
                  <div>
                    <div className="flex mb-1">{renderStars(product?.rating)}</div>
                    <div className="text-sm text-gray-600">{product?.reviewCount} reviews</div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-6">
                    <div className="flex items-center mb-2">
                      <div className="flex mr-2">{renderStars(5)}</div>
                      <span className="font-medium">Sarah J.</span>
                    </div>
                    <h4 className="font-medium mb-1">Absolutely stunning!</h4>
                    <p className="text-gray-700 mb-2">The ring is even more beautiful in person. The diamond sparkles brilliantly and the silver has a lovely shine. It's comfortable to wear and looks elegant.</p>
                    <span className="text-sm text-gray-500">Reviewed on March 15, 2023</span>
                  </div>
                  <div className="border-b border-gray-200 pb-6">
                    <div className="flex items-center mb-2">
                      <div className="flex mr-2">{renderStars(4)}</div>
                      <span className="font-medium">Michael T.</span>
                    </div>
                    <h4 className="font-medium mb-1">Great quality</h4>
                    <p className="text-gray-700 mb-2">Very pleased with this purchase. The craftsmanship is excellent. The only reason I didn't give 5 stars is that it took a bit longer to arrive than expected.</p>
                    <span className="text-sm text-gray-500">Reviewed on February 28, 2023</span>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'shipping' && (
              <div>
                <h3 className="text-xl font-medium mb-4">Shipping & Returns</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Shipping Information</h4>
                    <ul className="list-disc pl-5 text-gray-700 space-y-2">
                      <li>Free standard shipping on all orders over ₹50</li>
                      <li>Express shipping available at checkout</li>
                      <li>Processing time: 1-2 business days</li>
                      <li>Delivery time: 3-5 business days for standard shipping</li>
                      <li>International shipping available</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Returns & Exchanges</h4>
                    <ul className="list-disc pl-5 text-gray-700 space-y-2">
                      <li>30-day return policy</li>
                      <li>Items must be unused and in original condition</li>
                      <li>Free returns for domestic orders</li>
                      <li>Exchanges available for size or style</li>
                      <li>Refunds processed within 5 business days of receipt</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {similarProducts.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -5 }}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="bg-gray-100" style={{ aspectRatio: '1/1', maxHeight: '250px' }}>
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-contain p-4"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-1">{item.title}</h3>
                  <div className="flex items-center mb-2">
                    <div className="flex mr-1">
                      {renderStars(item.rating)}
                    </div>
                  </div>
                  <div className="font-bold">₹{item.price.toFixed(2)}</div>
                  <button className="mt-3 w-full border border-black py-2 rounded hover:bg-black hover:text-white transition">
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;