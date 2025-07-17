import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Settings,
} from 'lucide-react';

const Sidebar = ({ isOpen }) => {
  const navItems = [
    { path: '/admin', name: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { path: '/admin/users', name: 'Users', icon: <Users className="w-5 h-5" /> },
    { path: '/admin/product-list', name: 'All Products', icon: <Package className="w-5 h-5" /> },
    { path: '/admin/sales', name: 'Sales', icon: <ShoppingCart className="w-5 h-5" /> },
    { path: '/admin/settings', name: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div 
      className={`${isOpen ? 'w-64' : 'w-20'} bg-gray-800 text-white transition-all duration-300 ease-in-out flex flex-col`}
    >
      <div className="p-4 flex items-center justify-between">
        {isOpen && <h2 className="text-xl font-semibold">Admin</h2>}
      </div>
      
      <nav className="flex-1 mt-6">
        <ul>
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center p-3 mx-2 rounded-lg transition-colors ${
                    isActive ? 'bg-gray-700 text-white' : 'hover:bg-gray-700 text-gray-300'
                  }`
                }
              >
                <span className="flex items-center">
                  {item.icon}
                  {isOpen && <span className="ml-3">{item.name}</span>}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;