import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiChevronUp, FiChevronDown, FiFilter, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from 'react-redux';
import { gettAllUsers } from '../../features/admin/usersSlice';

const Users = () => {
  const dispatch = useDispatch();
  const usersState = useSelector((state) => state.users);
  const usersData = usersState?.users || [];
  const loading = usersState?.loading || false;
  const error = usersState?.error || null;
  const pagination = usersState?.pagination || {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  };
  
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(pagination.limit);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    isVerified: '',
    joinDateFrom: '',
    joinDateTo: ''
  });

  useEffect(() => {
    dispatch(gettAllUsers({ page: currentPage + 1, limit: itemsPerPage }))
      .unwrap()
      .catch(err => console.error("Failed to load users:", err));
  }, [dispatch, currentPage, itemsPerPage]);

  const processedUsers = usersData.map(user => ({
    id: user._id,
    name: user.name || 'No Name',
    email: user.email || 'No Email',
    phone: user.phone || 'No Phone',
    status: user.isVerified ? 'Verified' : 'Unverified',
    isVerified: user.isVerified || false,
    joinDate: user.createdAt || new Date().toISOString(),
    orders: 0 
  }));

  const statuses = [...new Set(processedUsers.map(user => user.status))];

  const filteredUsers = processedUsers.filter(user => {
    return (
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
       user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
       user.phone.includes(searchTerm)) &&
      (filters.status === '' || user.status === filters.status) &&
      (filters.isVerified === '' || user.isVerified === (filters.isVerified === 'true')) &&
      (filters.joinDateFrom === '' || new Date(user.joinDate) >= new Date(filters.joinDateFrom)) &&
      (filters.joinDateTo === '' || new Date(user.joinDate) <= new Date(filters.joinDateTo))
    );
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
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

  const pageCount = pagination.totalPages;
  const currentItems = sortedUsers;

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      isVerified: '',
      joinDateFrom: '',
      joinDateTo: ''
    });
  };

  const getInitials = (name) => {
    return name.split(' ').map(part => part[0]).join('').toUpperCase().substring(0, 2);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Verified': return 'bg-green-100 text-green-800';
      case 'Unverified': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
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

  if (loading && currentPage === 0) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="text-lg">Error loading users:</p>
          <p className="mt-2">{error.message || 'Unknown error occurred'}</p>
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
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">User Management</h1>
          <p className="text-gray-600">Manage your users with advanced controls</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users by name, email or phone..."
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
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(0);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>

              <NavLink 
                to="/users/add" 
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
              >
                <FiPlus /> Add User
              </NavLink>
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
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="">All Statuses</option>
                      {statuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Verification</label>
                    <select
                      value={filters.isVerified}
                      onChange={(e) => setFilters({ ...filters, isVerified: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="">All</option>
                      <option value="true">Verified</option>
                      <option value="false">Unverified</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Joined From</label>
                    <input
                      type="date"
                      value={filters.joinDateFrom}
                      onChange={(e) => setFilters({ ...filters, joinDateFrom: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Joined To</label>
                    <input
                      type="date"
                      value={filters.joinDateTo}
                      onChange={(e) => setFilters({ ...filters, joinDateTo: e.target.value })}
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
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    User
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('phone')}
                  >
                    <div className="flex items-center">
                      Phone
                      {sortConfig.key === 'phone' && (
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
                    onClick={() => requestSort('email')}
                  >
                    <div className="flex items-center">
                      Email
                      {sortConfig.key === 'email' && (
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
                    onClick={() => requestSort('orders')}
                  >
                    <div className="flex items-center">
                      Orders
                      {sortConfig.key === 'orders' && (
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
                    onClick={() => requestSort('status')}
                  >
                    <div className="flex items-center">
                      Status
                      {sortConfig.key === 'status' && (
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
                    onClick={() => requestSort('joinDate')}
                  >
                    <div className="flex items-center">
                      Join Date
                      {sortConfig.key === 'joinDate' && (
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
                {loading && currentPage > 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                      </div>
                    </td>
                  </tr>
                ) : currentItems.length > 0 ? (
                  <AnimatePresence>
                    {currentItems.map((user, index) => (
                      <motion.tr
                        key={user.id}
                        variants={tableRowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        custom={index}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-medium">
                              {getInitials(user.name)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{user.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.orders}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(user.joinDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              className="text-gray-500 hover:text-black"
                              onClick={() => navigate(`/users/edit/${user.id}`)}
                            >
                              <FiEdit />
                            </button>
                            <button className="text-gray-500 hover:text-red-500">
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                ) : (
                  <motion.tr
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                      No users found matching your criteria
                    </td>
                  </motion.tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">{currentPage * itemsPerPage + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min((currentPage + 1) * itemsPerPage, pagination.total)}
              </span>{' '}
              of <span className="font-medium">{pagination.total}</span> results
            </div>

            <ReactPaginate
              previousLabel={'Previous'}
              nextLabel={'Next'}
              breakLabel={'...'}
              pageCount={pageCount}
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
              forcePage={currentPage}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Users;