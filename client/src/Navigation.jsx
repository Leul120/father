import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppContext } from './App';
import { Menu, Dropdown } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';

const NavItem = ({ to, children, isActive, onClick }) => {
  return (
    <Link to={to} onClick={onClick}>
      <motion.div
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
        className={`relative px-4 py-3 transition-all duration-300 font-mono group ${
          isActive
            ? 'text-black font-semibold'
            : 'text-gray-600 hover:text-black'
        }`}
      >
        <span className="relative z-10 text-sm tracking-wide whitespace-nowrap">
          {children}
        </span>

        {/* Active indicator */}
        {isActive && (
          <motion.div
            className="absolute bottom-0 left-0 w-full h-0.5 bg-black"
            layoutId="navIndicator"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}

        {/* Hover indicator */}
        {!isActive && (
          <motion.div
            className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gray-400 group-hover:w-full group-hover:left-0 transition-all duration-300"
          />
        )}
      </motion.div>
    </Link>
  );
};

const HorizontalNavbar = () => {
  const { setUser, user, token } = useContext(AppContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setUser(JSON.parse(window.localStorage.getItem('user')));
  }, [setUser]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { to: "/", label: "HOME" },
    { to: "/user-profile", label: "PROFILE" },
    { to: "/experiences", label: "EXPERIENCE" },
    { to: "/skills", label: "SKILLS" },
    { to: "/educations", label: "EDUCATION" },
    { to: "/languages", label: "LANGUAGES" },
    { to: "/certificates", label: "CERTIFICATES" },
    { to: "/awards", label: "AWARDS" },
    { to: "/publications", label: "PUBLICATIONS" },
  ];

  const userMenu = (
    <Menu className="font-mono rounded-lg border border-gray-300 shadow-lg min-w-[180px]">
      <Menu.Item key="profile" className="font-medium">
        <Link to="/settings" className="text-gray-900 hover:text-black">
          SETTINGS
        </Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item 
        key="logout" 
        className="font-medium text-red-600 hover:text-red-700"
        onClick={() => {
          window.localStorage.removeItem("token");
          window.localStorage.removeItem("user");
          window.location.reload();
        }}
      >
        LOGOUT
      </Menu.Item>
    </Menu>
  );

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 font-mono transition-all duration-500 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm' 
          : 'bg-white border-b border-gray-100'
      }`}
    >
      <div className="w-full mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.02 }}
          >
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 border-2 border-black flex items-center justify-center">
                <span className="font-bold text-black text-sm">P</span>
              </div>
              <div className="hidden sm:block">
                <div className="font-bold text-black text-lg tracking-tight">
                  PROFILE
                </div>
                <div className="text-xs text-gray-500 -mt-1 tracking-widest">PORTFOLIO</div>
              </div>
            </Link>
          </motion.div>

          {/* Main Navigation - Desktop */}
          <nav className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item) => (
              <NavItem 
                key={item.to} 
                to={item.to}
                isActive={location.pathname === item.to}
              >
                {item.label}
              </NavItem>
            ))}
          </nav>

          {/* Right Side - User Menu */}
          <div className="flex items-center space-x-4">
            {/* User Info */}
            <div className="hidden md:flex items-center space-x-3 text-right">
              <div className="border-r border-gray-300 pr-4">
                <div className="font-semibold text-black text-sm tracking-wide">
                  {user?.name || 'USER'}
                </div>
                <div className="text-xs text-gray-500 tracking-wide">ACTIVE</div>
              </div>
            </div>

            {/* User Dropdown */}
            <Dropdown overlay={userMenu} trigger={['click']} placement="bottomRight">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:border-black transition-colors"
              >
                <div className="w-6 h-6 bg-black text-white rounded-sm flex items-center justify-center">
                  <span className="font-bold text-xs">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <span className="text-xs text-gray-600 font-medium tracking-wide">▼</span>
                </div>
              </motion.button>
            </Dropdown>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:border-black transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <div className="flex flex-col space-y-1">
                  <div className={`w-4 h-0.5 bg-black transition-all duration-300 ${
                    isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                  }`} />
                  <div className={`w-4 h-0.5 bg-black transition-all duration-300 ${
                    isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`} />
                  <div className={`w-4 h-0.5 bg-black transition-all duration-300 ${
                    isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                  }`} />
                </div>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white border-t border-gray-200"
          >
            <div className="px-6 py-4 space-y-1">
              {menuItems.map((item) => (
                <NavItem
                  key={item.to}
                  to={item.to}
                  isActive={location.pathname === item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </NavItem>
              ))}
              
              {/* Mobile User Section */}
              <div className="pt-4 mt-4 border-t border-gray-200 space-y-3">
                <div className="flex items-center space-x-3 px-4 py-2">
                  <div className="w-8 h-8 bg-black text-white rounded-sm flex items-center justify-center">
                    <span className="font-bold text-xs">
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-black text-sm">
                      {user?.name || 'USER'}
                    </div>
                    <div className="text-xs text-gray-500">PROFILE</div>
                  </div>
                </div>
                
                <Link 
                  to="/settings" 
                  className="block px-4 py-2 text-gray-600 hover:text-black transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  SETTINGS
                </Link>
                
                <div 
                  className="block px-4 py-2 text-red-600 hover:text-red-700 transition-colors font-medium cursor-pointer"
                  onClick={() => {
                    window.localStorage.removeItem("token");
                    window.localStorage.removeItem("user");
                    window.location.reload();
                  }}
                >
                  LOGOUT
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default HorizontalNavbar;