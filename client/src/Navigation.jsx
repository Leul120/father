import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppContext } from './App';
import { Menu, Dropdown } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';

const NavItem = ({ to, children, isActive, onClick, isMobile = false }) => {
  return (
    <Link to={to} onClick={onClick} className="block">
      <motion.div
        whileHover={{ y: isMobile ? 0 : -1 }}
        whileTap={{ scale: 0.98 }}
        className={`relative transition-all duration-300 font-mono group ${
          isMobile 
            ? 'px-4 py-3 border-b border-gray-100' 
            : 'px-4 py-3'
        } ${
          isActive
            ? 'text-black font-semibold bg-gray-50'
            : 'text-gray-600 hover:text-black hover:bg-gray-50'
        }`}
      >
        <span className={`relative z-10 tracking-wide whitespace-nowrap ${
          isMobile ? 'text-base' : 'text-sm'
        }`}>
          {children}
        </span>

        {/* Active indicator for desktop */}
        {!isMobile && isActive && (
          <motion.div
            className="absolute bottom-0 left-0 w-full h-0.5 bg-black"
            layoutId="navIndicator"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}

        {/* Hover indicator for desktop */}
        {!isMobile && !isActive && (
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
  const mobileMenuRef = useRef(null);

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

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
      <Menu.Item key="profile" className="font-medium py-2">
        
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item 
        key="logout" 
        className="font-medium text-red-600 hover:text-red-700 py-2"
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
      <div className="w-full mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <motion.div 
            className="flex items-center flex-shrink-0"
            whileHover={{ scale: 1.02 }}
          >
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 border-2 border-black flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-black text-xs sm:text-sm">P</span>
              </div>
              <div className="hidden xs:block">
                <div className="font-bold text-black text-base sm:text-lg tracking-tight leading-none">
                  PROFILE
                </div>
                <div className="text-xs text-gray-500 tracking-widest leading-none">PORTFOLIO</div>
              </div>
            </Link>
          </motion.div>

          {/* Main Navigation - Desktop */}
          <nav className="hidden xl:flex items-center space-x-1 overflow-x-auto ">
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
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* User Info - Desktop */}
            <div className="hidden md:flex items-center space-x-3 text-right">
              <div className="border-r border-gray-300 pr-3 sm:pr-4">
                <div className="font-semibold text-black text-sm tracking-wide truncate max-w-[120px]">
                  {user?.name || 'USER'}
                </div>
                <div className="text-xs text-gray-500 tracking-wide">ACTIVE</div>
              </div>
            </div>

            {/* User Dropdown - Desktop */}
            <div className="hidden md:block">
              <Dropdown menu={userMenu} trigger={['click']} placement="bottomRight">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center space-x-2 px-2 sm:px-3 py-2 border border-gray-300 rounded-lg hover:border-black transition-colors flex-shrink-0"
                >
                  <div className="w-6 h-6 bg-black text-white rounded-sm flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-xs">
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-600 font-medium tracking-wide">▼</span>
                  </div>
                </motion.button>
              </Dropdown>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:border-black transition-colors flex-shrink-0"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
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
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Mobile Menu Content */}
            <motion.div
              ref={mobileMenuRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-white border-t border-gray-200 shadow-lg absolute top-16 left-0 right-0 z-50 max-h-[80vh] overflow-y-auto"
            >
              <div className="px-4 py-2 space-y-0">
                {menuItems.map((item) => (
                  <NavItem
                    key={item.to}
                    to={item.to}
                    isActive={location.pathname === item.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    isMobile={true}
                  >
                    {item.label}
                  </NavItem>
                ))}
                
                {/* Mobile User Section */}
                <div className="pt-3 mt-2 border-t border-gray-200 space-y-2">
                  <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-black text-white rounded-sm flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-xs">
                        {user?.name?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-black text-sm truncate">
                        {user?.name || 'USER'}
                      </div>
                      <div className="text-xs text-gray-500 truncate">PROFILE</div>
                    </div>
                  </div>
                  
                
                  
                  <button 
                    className="block w-full text-left px-4 py-3 text-red-600 hover:text-red-700 hover:bg-gray-50 transition-colors font-medium rounded-lg"
                    onClick={() => {
                      window.localStorage.removeItem("token");
                      window.localStorage.removeItem("user");
                      window.location.reload();
                    }}
                  >
                    LOGOUT
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default HorizontalNavbar;