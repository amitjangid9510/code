import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery, setPage, fetchProducts, clearSearch } from '../../features/user/productSlice';
import { 
  ChevronDown, 
  Menu, 
  X, 
  ShoppingCart, 
  Search, 
  LogOut, 
  ChevronRight,
  User,
  Heart,
  Home,
  Info,
  Mail
} from 'lucide-react';
import { logoutUser } from '../../features/auth/authSlice';

const Header = () => {
  const location = useLocation();
  const { searchQuery } = useSelector((state) => state.products.filters);
  const { status } = useSelector((state) => state.products);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const [previousPath, setPreviousPath] = useState('/');
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { items: cartItems, total: cartTotal } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const categoryRef = useRef(null);
  const userMenuRef = useRef(null);
  const debounceTimeout = useRef(null);
  const cartItemCount = cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;

  useEffect(() => {
    if (!location.pathname.startsWith('/products') && location.pathname !== '/') {
      setPreviousPath(location.pathname);
    }
  }, [location]);

  useEffect(() => {
    setLocalSearch(searchQuery || '');
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        if (!event.target.closest('.search-icon')) {
          setSearchOpen(false);
        }
      }
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setActiveCategory(null);
        setActiveSubcategory(null);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = useCallback((query) => {
    if (query.trim()) {
      dispatch(setSearchQuery(query));
      dispatch(setPage(1));
      dispatch(fetchProducts({ 
        page: 1, 
        limit: 10, 
        search: query,
        filters: {} 
      }));
      if (window.location.pathname !== '/products') {
        navigate('/products');
      }
    } else {
      if (window.location.pathname.startsWith('/products')) {
        navigate(previousPath || '/');
      }
      dispatch(clearSearch());
    }
  }, [dispatch, navigate, previousPath]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearch(value);
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      handleSearch(value);
    }, 500);
  };

  const handleClearSearch = () => {
    setLocalSearch('');
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    handleSearch('');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    handleSearch(localSearch);
    setSearchOpen(false);
  };

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  const handleLogout = () => {
    setMobileMenuOpen(false);
    dispatch(logoutUser());
    navigate('/login');
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  const handleCategoryHover = (categoryName) => {
    setActiveCategory(categoryName);
    setActiveSubcategory(null);
  };

  const handleSubcategoryHover = (subcategoryName) => {
    setActiveSubcategory(subcategoryName);
  };

  const categories = [
    { 
      name: 'Rings',
      image: '7ae290dfdeb8040210a2d1d635ae6e13', 
      subcategories: [
        { 
          name: 'Engagement Rings', 
          path: '/rings/engagement-rings',
          popularItems: ['Solitaire', 'Halo', 'Three-Stone', 'Vintage-Inspired']
        },
        { 
          name: 'Wedding Bands', 
          path: '/rings/wedding-bands',
          popularItems: ['Classic Gold', 'Diamond Eternity', 'Platinum', 'Stackable']
        },
        { 
          name: 'Cocktail Rings', 
          path: '/rings/cocktail-rings',
          popularItems: ['Oversized Gemstone', 'Art Deco', 'Colorful', 'Vintage']
        },
        { 
          name: 'Statement Rings', 
          path: '/rings/statement-rings',
          popularItems: ['Bold Designs', 'Geometric', 'Floral', 'Modern Art']
        },
        { 
          name: 'Stackable Rings', 
          path: '/rings/stackable-rings',
          popularItems: ['Thin Bands', 'Birthstone', 'Minimalist', 'Mixed Metals']
        },
        { 
          name: 'Promise Rings', 
          path: '/rings/promise-rings',
          popularItems: ['Heart', 'Infinity', 'Claddagh', 'Personalized']
        },
        { 
          name: 'Birthstone Rings', 
          path: '/rings/birthstone-rings',
          popularItems: ['Zodiac', 'Stackable', 'Solitaire', 'Custom']
        },
        { 
          name: 'Solitaire Rings', 
          path: '/rings/solitaire-rings',
          popularItems: ['Round Diamond', 'Emerald Cut', 'Princess Cut', 'Pear']
        }
      ]
    },
    { 
      name: 'Necklaces',
      image: 'a9b3e5dbd20f1ab19a70cb5f2f3cfa5f', 
      subcategories: [
        { 
          name: 'Chains', 
          path: '/necklaces/chains',
          popularItems: ['Figaro', 'Cable', 'Rope', 'Box']
        },
        { 
          name: 'Pendants', 
          path: '/necklaces/pendants',
          popularItems: ['Initial', 'Heart', 'Cross', 'Minimalist']
        },
        { 
          name: 'Lockets', 
          path: '/necklaces/lockets',
          popularItems: ['Photo', 'Heart-Shaped', 'Vintage', 'Engraved']
        },
        { 
          name: 'Chokers', 
          path: '/necklaces/chokers',
          popularItems: ['Velvet', 'Pearl', 'Layered', 'Dainty']
        },
        { 
          name: 'Name Necklaces', 
          path: '/necklaces/name-necklaces',
          popularItems: ['Custom Script', 'Bar', 'Minimalist', 'Birthstone']
        },
        { 
          name: 'Layered Necklaces', 
          path: '/necklaces/layered-necklaces',
          popularItems: ['Gold & Silver', 'Delicate Chains', 'Personalized', 'Mixed Lengths']
        },
        { 
          name: 'Religious Necklaces', 
          path: '/necklaces/religious-necklaces',
          popularItems: ['Cross', 'Evil Eye', 'Hamsa', 'Om']
        },
        { 
          name: 'Statement Necklaces', 
          path: '/necklaces/statement-necklaces',
          popularItems: ['Beaded', 'Pearl', 'Geometric', 'Bold Pendant']
        }
      ]
    },
    { 
      name: 'Earrings',
      image: '5c1aef4c7ecfeb89cb241149b95a4a1a',  
      subcategories: [
        { 
          name: 'Stud Earrings', 
          path: '/earrings/stud-earrings',
          popularItems: ['Diamond', 'Pearl', 'Gemstone', 'Minimalist']
        },
        { 
          name: 'Hoop Earrings', 
          path: '/earrings/hoop-earrings',
          popularItems: ['Small Huggies', 'Oversized', 'Thin', 'Textured']
        },
        { 
          name: 'Drop Earrings', 
          path: '/earrings/drop-earrings',
          popularItems: ['Pearl Dangle', 'Chandelier', 'Tassel', 'Geometric']
        },
        { 
          name: 'Dangle Earrings', 
          path: '/earrings/dangle-earrings',
          popularItems: ['Crystal', 'Boho', 'Vintage', 'Minimalist']
        },
        { 
          name: 'Ear Cuffs', 
          path: '/earrings/ear-cuffs',
          popularItems: ['Cartilage', 'Helix', 'Mid-Ear', 'Wrap-Around']
        },
        { 
          name: 'Clip-on Earrings', 
          path: '/earrings/clip-on-earrings',
          popularItems: ['Vintage', 'Pearl', 'Statement', 'Floral']
        },
        { 
          name: 'Huggies', 
          path: '/earrings/huggies',
          popularItems: ['Diamond', 'Gold', 'Silver', 'Textured']
        },
        { 
          name: 'Jhumkas (Traditional)', 
          path: '/earrings/jhumkas',
          popularItems: ['Temple Style', 'Pearl', 'Antique', 'Festive']
        }
      ]
    },
    { 
      name: 'Bracelets',
      image: 'c385298564b3f2e4e319a0ef9c3547ca',  
      subcategories: [
        { 
          name: 'Bangles', 
          path: '/bracelets/bangles',
          popularItems: ['Stackable', 'Cuff', 'Charm', 'Hinged']
        },
        { 
          name: 'Cuffs', 
          path: '/bracelets/cuffs',
          popularItems: ['Hammered', 'Engraved', 'Filigree', 'Adjustable']
        },
        { 
          name: 'Chain Bracelets', 
          path: '/bracelets/chain-bracelets',
          popularItems: ['Figaro', 'Cable', 'Rope', 'Delicate']
        },
        { 
          name: 'Charm Bracelets', 
          path: '/bracelets/charm-bracelets',
          popularItems: ['Pandora-Style', 'Initial', 'Birthstone', 'Travel']
        },
        { 
          name: 'Tennis Bracelets', 
          path: '/bracelets/tennis-bracelets',
          popularItems: ['Diamond', 'Sapphire', 'Ruby', 'Emerald']
        },
        { 
          name: 'Kada (Traditional)', 
          path: '/bracelets/kada',
          popularItems: ['Gold', 'Silver', 'Engraved', 'Bridal']
        }
      ]
    },
    {
      name: 'Collections',
      image: '27d4acf9881d4886625b46798309801f', 
      subcategories: [
        { 
          name: 'Bridal', 
          path: '/collections/bridal',
          popularItems: ['Bridal Sets', 'Veil jewellery', 'Something Blue', 'Pearl']
        },
        { 
          name: 'Vintage', 
          path: '/collections/vintage',
          popularItems: ['Art Deco', 'Victorian', 'Retro', 'Antique']
        },
        { 
          name: 'Minimalist', 
          path: '/collections/minimalist',
          popularItems: ['Delicate Chains', 'Thin Bands', 'Tiny Studs', 'Dainty']
        },
        { 
          name: 'Statement', 
          path: '/collections/statement',
          popularItems: ['Oversized', 'Colorful', 'Geometric', 'Bold']
        }
      ]
    }
  ];

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="bg-black text-white text-center py-2 text-sm">
        Free worldwide shipping on orders over ₹500
      </div>

      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <nav className="hidden lg:flex space-x-8" ref={categoryRef}>
            {categories.map((category) => (
              <div 
                key={category.name}
                className="relative group"
                onMouseEnter={() => handleCategoryHover(category.name)}
                onMouseLeave={() => {
                  if (activeSubcategory === null) {
                    setActiveCategory(null);
                  }
                }}
              >
                <button className="flex items-center font-medium text-gray-700 hover:text-black transition-colors uppercase tracking-wider text-sm">
                  {category.name}
                  <ChevronDown className="ml-1 w-4 h-4" />
                </button>

                <AnimatePresence>
                  {activeCategory === category.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 top-full mt-2 w-[800px] bg-white shadow-xl rounded-sm py-4 z-50 border border-gray-100 grid grid-cols-3"
                    >
                      <div className="col-span-1 border-r border-gray-100 px-6 py-2">
                        <h3 className="font-medium text-lg mb-2">{category.name}</h3>
                        <Link 
                          to={`/shop/${category.name.toLowerCase()}`}
                          className="text-sm font-medium hover:underline hover:text-blue-800"
                        >
                          Shop All {category.name}
                        </Link>
                        <div className="mb-3 w-full h-32 bg-gray-50 overflow-hidden rounded-md">
                          <img 
                            src={`${category.image.toLowerCase()}.jpg`} 
                            alt={category.name}
                            className="w-full h-full object-cover object-center"
                          />
                        </div>
                      </div>
                      
                      <div className="col-span-2 grid grid-cols-2 gap-4 px-6 py-2">
                        {category.subcategories.map((sub) => (
                          <div 
                            key={sub.name}
                            className="group"
                            onMouseEnter={() => handleSubcategoryHover(sub.name)}
                          >
                            <Link
                              to={sub.path}
                              className="flex items-center justify-between font-medium hover:text-black transition-colors pb-2 border-b border-gray-100"
                            >
                              {sub.name}
                              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                            
                            <AnimatePresence>
                              {activeSubcategory === sub.name && (
                                <motion.div
                                  initial={{ opacity: 0, x: 10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: 10 }}
                                  className="mt-2"
                                >
                                  <div className="text-sm">
                                    <ul className="space-y-1">
                                      {sub.popularItems.map((item) => (
                                        <li key={item} className="hover:underline cursor-pointer hover:text-blue-800">
                                          {item}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          <button 
            className="lg:hidden text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu />
          </button>

          <Link to="/" className="text-2xl font-serif font-bold tracking-wider mx-auto lg:mx-0">
            jewellery
          </Link>

          <div className="flex items-center space-x-6">
            <button 
              className="search-icon text-gray-700 hover:text-black transition-colors"
              onClick={toggleSearch}
            >
              <Search />
            </button>

            <Link to="/checkout" className="relative text-gray-700 hover:text-black transition-colors">
              <ShoppingCart />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="hidden lg:flex items-center space-x-2 relative" ref={userMenuRef}>
                <div 
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  onMouseEnter={() => setUserMenuOpen(true)}
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-medium">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </div>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-md py-1 z-50 border border-gray-100"
                      onMouseLeave={() => setUserMenuOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium">Hello, {user.name?.split(' ')[0]}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      
                      <Link
                        to="/account"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4 mr-2" />
                        My Account
                      </Link>
                      
                      <Link
                        to="/wishlist"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        Wishlist
                      </Link>
      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-t border-gray-100"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="hidden lg:block text-sm text-gray-700 hover:text-black transition-colors uppercase tracking-wider"
              >
                Account
              </Link>
            )}
          </div>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mt-4"
              ref={searchRef}
            >
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search our collection..."
                    className="w-full px-4 py-3 border-b border-gray-200 focus:outline-none focus:border-black text-gray-700"
                    autoFocus
                    value={localSearch}
                    onChange={handleSearchChange}
                  />
                  {localSearch && (
                    <button
                      type="button"
                      className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-700"
                      onClick={handleClearSearch}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button 
                    type="submit"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-700"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                  {status === 'loading' && (
                    <div className="absolute right-20 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-500"></div>
                    </div>
                  )}
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="fixed inset-0 bg-white z-50 lg:hidden overflow-y-auto"
          >
            <div className="container mx-auto px-6 py-4">
              <div className="flex justify-between items-center mb-8">
                <Link to="/" className="text-2xl font-serif font-bold tracking-wider">
                  jewellery
                </Link>
                <button 
                  className="text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X />
                </button>
              </div>

              <div className="mb-8">
                {isAuthenticated ? (
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">Welcome back</p>
                      <p className="text-sm text-gray-500">{user.name}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex space-x-4 mb-6">
                    <Link 
                      onClick={() => setMobileMenuOpen(false)}
                      to="/login" 
                      className="px-4 py-2 border border-black text-sm uppercase tracking-wider"
                    >
                      Sign In
                    </Link>
                    <Link 
                      onClick={() => setMobileMenuOpen(false)}
                      to="/signup" 
                      className="px-4 py-2 bg-black text-white text-sm uppercase tracking-wider"
                    >
                      Sign up
                    </Link>
                  </div>
                )}                
                <div className="relative mb-4">
                  <form onSubmit={handleSearchSubmit}>
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full px-4 py-3 border-b border-gray-200 focus:outline-none focus:border-black text-gray-700"
                      value={localSearch}
                      onChange={handleSearchChange}
                    />
                    {localSearch && (
                      <button
                        type="button"
                        className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-700"
                        onClick={handleClearSearch}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    <button 
                      type="submit"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-700"
                    >
                      <Search className="w-5 h-5" />
                    </button>
                    {status === 'loading' && (
                      <div className="absolute right-16 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-500"></div>
                      </div>
                    )}
                  </form>
                </div>
              </div>

              <nav className="space-y-6">
                <Link 
                  to="/" 
                  className="flex items-center py-3 border-b border-gray-100 text-gray-700 uppercase tracking-wider text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Link>

                <Link 
                  to="/account" 
                  className="flex items-center py-3 border-b border-gray-100 text-gray-700 uppercase tracking-wider text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="w-4 h-4 mr-2" />
                   My Account
                </Link>

                <Link 
                  to="/wishlist" 
                  className="flex items-center py-3 border-b border-gray-100 text-gray-700 uppercase tracking-wider text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Heart className="w-4 h-4 mr-2" />
                   Wishlist
                </Link>

                {categories.map((category) => (
                  <div key={category.name} className="border-b border-gray-100">
                    <button 
                      className="w-full flex justify-between items-center py-3 text-gray-700 uppercase tracking-wider text-sm"
                      onClick={() => {
                        if (activeCategory === category.name) {
                          setActiveCategory(null);
                        } else {
                          setActiveCategory(category.name);
                        }
                      }}
                    >
                      {category.name}
                      <ChevronDown className={`w-4 h-4 transition-transform ${activeCategory === category.name ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                      {activeCategory === category.name && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-4 pb-4">
                            <Link 
                              to={`/shop/${category.name.toLowerCase()}`}
                              className="text-sm font-medium hover:underline mb-3 inline-block"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              Shop All {category.name}
                            </Link>
                            
                            <div className="space-y-4">
                              {category.subcategories.map((sub) => (
                                <div key={sub.name} className="border-t border-gray-100 pt-3">
                                  <Link
                                    to={sub.path}
                                    className="block font-medium text-gray-700 mb-1"
                                    onClick={() => setMobileMenuOpen(false)}
                                  >
                                    {sub.name}
                                  </Link>
                                  <div className="text-xs">
                                    <div className="flex flex-wrap gap-2">
                                      {sub.popularItems.map((item) => (
                                        <span key={item} className="bg-gray-100 px-2 py-1 rounded">
                                          {item}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}

                <Link 
                  to="/about" 
                  className="flex items-center py-3 border-b border-gray-100 text-gray-700 uppercase tracking-wider text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Info className="w-4 h-4 mr-2" />
                  About
                </Link>
                <Link 
                  to="/contact" 
                  className="flex items-center py-3 border-b border-gray-100 text-gray-700 uppercase tracking-wider text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Contact
                </Link>
              </nav>

              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="w-full mt-8 py-3 border-t border-gray-100 flex items-center justify-center space-x-2 text-gray-700 uppercase tracking-wider text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;