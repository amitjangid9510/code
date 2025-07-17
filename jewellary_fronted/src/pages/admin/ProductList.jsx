import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiChevronUp, FiChevronDown, FiFilter, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, setItemsPerPage, deleteProduct} from '../../features/admin/productSlice';

const ProductList = () => {
  const dispatch = useDispatch();
const {
  data: products = [],
  loading: status = 'idle',
  error,
  pagination: {
    page: currentPage = 1,
    totalPages = 1,
    totalProducts = 0,
    limit: itemsPerPage = 10
  } = {},
  deleteStatus = 'idle'
} = useSelector((state) => state.products);
  
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    subCategory: '',
    material: '',
    purity: '',
    minPrice: '',
    maxPrice: '',
    minStock: '',
    gender: '',
    occasion: '',
    isReturnable: ''
  });

  useEffect(() => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
      search: searchTerm,
      ...filters
    };
    
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) {
        delete params[key];
      }
    });
    
    dispatch(fetchProducts(params));
  }, [currentPage, itemsPerPage, searchTerm, filters, dispatch]);

  const categories = [...new Set(products?.map(p => p.category) || [])];
  const materials = [...new Set(products?.map(p => p.material) || [])];
  const genders = [...new Set(products?.map(p => p.gender) || [])];
  const occasions = [...new Set(products?.flatMap(p => p.occasion) || [])];

  const sortedProducts = [...products || []].sort((a, b) => {
    if (sortConfig.key) {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handlePageClick = ({ selected }) => {
    dispatch(fetchProducts({
      ...filters,
      page: selected + 1,
      limit: itemsPerPage,
      search: searchTerm
    }));
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      subCategory: '',
      material: '',
      purity: '',
      minPrice: '',
      maxPrice: '',
      minStock: '',
      gender: '',
      occasion: '',
      isReturnable: ''
    });
  };

  const handleItemsPerPageChange = (e) => {
    const newLimit = Number(e.target.value);
    dispatch(setItemsPerPage(newLimit));
    dispatch(fetchProducts({
      ...filters,
      page: 1,
      limit: newLimit,
      search: searchTerm
    }));
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await dispatch(deleteProduct(productId)).unwrap();
        dispatch(fetchProducts({
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm,
          ...filters
        }));
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const tableRowVariants = {
    hidden: { opacity: 0 },
    visible: (i) => ({
      opacity: 1,
      transition: {
        delay: i * 0.05
      }
    })
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto mb-4"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>Error loading products: {error?.message || 'Unknown error'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8">
      <div className="mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.1 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Product Management</h1>
          <p className="text-gray-600">Manage your jewellery inventory with advanced controls</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1, delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                <FiFilter /> Filters
              </button>

              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>

              <button 
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                onClick={() => navigate('/admin/products')}
              >
                <FiPlus /> Add Product
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={filters.category}
                      onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                    <select
                      value={filters.material}
                      onChange={(e) => setFilters({ ...filters, material: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="">All Materials</option>
                      {materials.map(material => (
                        <option key={material} value={material}>{material}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      value={filters.gender}
                      onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="">All Genders</option>
                      {genders.map(gender => (
                        <option key={gender} value={gender}>{gender}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Occasion</label>
                    <select
                      value={filters.occasion}
                      onChange={(e) => setFilters({ ...filters, occasion: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="">All Occasions</option>
                      {occasions.map(occasion => (
                        <option key={occasion} value={occasion}>{occasion}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                    <input
                      type="number"
                      placeholder="₹ Min"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                    <input
                      type="number"
                      placeholder="₹ Max"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 mr-2"
                  >
                    Reset Filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('name')}
                  >
                    <div className="flex items-center">
                      Product Name
                      {sortConfig.key === 'name' && (
                        sortConfig.direction === 'asc' ? (
                          <FiChevronUp className="ml-1" />
                        ) : (
                          <FiChevronDown className="ml-1" />
                        )
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('category')}
                  >
                    <div className="flex items-center">
                      Category
                      {sortConfig.key === 'category' && (
                        sortConfig.direction === 'asc' ? (
                          <FiChevronUp className="ml-1" />
                        ) : (
                          <FiChevronDown className="ml-1" />
                        )
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('sellingPrice')}
                  >
                    <div className="flex items-center">
                      Price
                      {sortConfig.key === 'sellingPrice' && (
                        sortConfig.direction === 'asc' ? (
                          <FiChevronUp className="ml-1" />
                        ) : (
                          <FiChevronDown className="ml-1" />
                        )
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('stock')}
                  >
                    <div className="flex items-center">
                      Stock
                      {sortConfig.key === 'stock' && (
                        sortConfig.direction === 'asc' ? (
                          <FiChevronUp className="ml-1" />
                        ) : (
                          <FiChevronDown className="ml-1" />
                        )
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('material')}
                  >
                    <div className="flex items-center">
                      Material
                      {sortConfig.key === 'material' && (
                        sortConfig.direction === 'asc' ? (
                          <FiChevronUp className="ml-1" />
                        ) : (
                          <FiChevronDown className="ml-1" />
                        )
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('ratingsAverage')}
                  >
                    <div className="flex items-center">
                      Rating
                      {sortConfig.key === 'ratingsAverage' && (
                        sortConfig.direction === 'asc' ? (
                          <FiChevronUp className="ml-1" />
                        ) : (
                          <FiChevronDown className="ml-1" />
                        )
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <AnimatePresence>
                  {sortedProducts.length > 0 ? (
                    sortedProducts.map((product, index) => (
                      <motion.tr
                        key={product._id}
                        variants={tableRowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        custom={index}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{product.category}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            ₹{product.sellingPrice?.toFixed(2)}
                            {product.discount > 0 && (
                              <span className="ml-2 text-xs text-green-500">{product.discount}% off</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.stock < 10 ? 'bg-red-100 text-red-800' : product.stock < 20 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                            {product.stock} in stock
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{product.material}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${i < Math.floor(product.ratingsAverage) ? 'fill-current' : i < product.ratingsAverage ? 'fill-current opacity-50' : 'opacity-20'}`}
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                </svg>
                              ))}
                            </div>
                            <span className="ml-1 text-sm text-gray-500">{product.ratingsAverage || '0'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              className="text-gray-500 hover:text-black" 
                              onClick={() => navigate(`/admin/product-update/${product._id}`)}
                            >
                              <FiEdit />
                            </button>
                            <button 
                              className={`text-gray-500 hover:text-red-500 ${
                                deleteStatus === 'pending' ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              onClick={() => handleDelete(product._id)}
                              disabled={deleteStatus === 'pending'}
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <motion.tr
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                        No products found matching your criteria
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, totalProducts)}
              </span>{' '}
              of <span className="font-medium">{totalProducts}</span> results
            </div>

            <ReactPaginate
              previousLabel={'Previous'}
              nextLabel={'Next'}
              breakLabel={'...'}
              pageCount={totalPages}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName="flex space-x-1"
              pageLinkClassName="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
              previousLinkClassName="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
              nextLinkClassName="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
              breakLinkClassName="px-3 py-1 border border-gray-300 rounded"
              activeLinkClassName="bg-black text-white border-black"
              disabledLinkClassName="text-gray-400 cursor-not-allowed hover:bg-white"
              forcePage={currentPage - 1}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductList;