import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppContext } from './App';
import { Menu, Dropdown } from 'antd';
import { MenuOutlined } from '@ant-design/icons';

const MenuItem = ({ icon, to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to}>
      <div
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
          isActive
            ? 'bg-blue-600 text-white'
            : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
        }`}
      >
        <span className={`${isActive ? 'text-white' : 'text-blue-600'}`}>
          {icon}
        </span>
        <span className="font-medium text-sm whitespace-nowrap">{children}</span>
      </div>
    </Link>
  );
};

const HorizontalNavbar = () => {
  const { setUser, user } = useContext(AppContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setUser(JSON.parse(window.localStorage.getItem('user')));
  }, [setUser]);

  const menuItems = [
    {icon:"H",to:"/",label:"Home"},
    { icon: '👤', to: '/user-profile', label: 'Profile' },
    { icon: '💼', to: '/experiences', label: 'Experiences' },
    { icon: '🛠️', to: '/skills', label: 'Skills' },
    { icon: '🎓', to: '/educations', label: 'Education' },
    { icon: '🌎', to: '/languages', label: 'Languages' },
    { icon: '🏆', to: '/certificates', label: 'Certificates' },
    { icon: '⭐', to: '/awards', label: 'Awards' },
    { icon: '📚', to: '/publications', label: 'Publications' },
  ];

  const userMenu = (
    <Menu>
      <Menu.Item key="0">
        <Link to="/settings">Settings</Link>
      </Menu.Item>
      <Menu.Item key="1">
        <div onClick={()=>{
          window.localStorage.removeItem("token")
        }}>Logout</div>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="w-full bg-white shadow-md">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          

          {/* Main Navigation */}
          <nav className="hidden md:flex flex-1 justify-center overflow-x-auto">
            <div className="flex space-x-2">
              {menuItems.map((item) => (
                <MenuItem key={item.to} icon={item.icon} to={item.to}>
                  {item.label}
                </MenuItem>
              ))}
            </div>
          </nav>

          {/* User Menu */}
          <div className="flex-shrink-0">
            <Dropdown overlay={userMenu} trigger={['click']}>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200">
                <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  {user?.name?.[0] || 'U'}
                </span>
                <span className="hidden sm:inline">{user?.name || 'User'}</span>
              </button>
            </Dropdown>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <MenuOutlined className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 py-2 space-y-1 bg-white shadow-lg">
          {menuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default HorizontalNavbar;
