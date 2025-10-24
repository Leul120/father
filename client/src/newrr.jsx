import { useState, useEffect, useContext, useRef, memo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  FaUserGraduate, FaBriefcase, FaAward, FaLanguage,
  FaCertificate, FaEnvelope, FaPhone, FaMapMarkerAlt,
  FaChevronRight, FaLinkedin, FaTwitter, FaExternalLinkAlt,
  FaMedal, FaBookOpen, FaGlobeAmericas, FaFacebook,
  FaRegEdit, FaStar, FaQuoteLeft, FaDownload,
  FaRocket, FaLightbulb, FaCode, FaMicroscope,
  FaGraduationCap, FaTrophy, FaGlobe, FaHeart,
  FaChevronDown, FaChevronUp, FaTools, FaLayerGroup,
  FaBars, FaTimes
} from 'react-icons/fa';
import { 
  SiJavascript, SiPython, SiReact, SiNodedotjs, SiDocker 
} from 'react-icons/si';
import { CiLogin } from "react-icons/ci";
import { Upload, Progress } from 'antd';
import { AppContext } from './App';
import { Link } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL;

// Custom hook for scroll progress
const useScrollProgress = () => {
  const [completion, setCompletion] = useState(0);
  
  useEffect(() => {
    const updateScrollCompletion = () => {
      const currentProgress = window.scrollY;
      const scrollHeight = document.body.scrollHeight - window.innerHeight;
      if (scrollHeight) {
        setCompletion(Number((currentProgress / scrollHeight).toFixed(2)) * 100);
      }
    };

    window.addEventListener('scroll', updateScrollCompletion);
    return () => window.removeEventListener('scroll', updateScrollCompletion);
  }, []);

  return completion;
};

// Mobile Navigation
const MobileNav = ({ isOpen, onClose }) => {
  const sections = [
    { id: 'home', label: 'Home', icon: FaUserGraduate },
    { id: 'experience', label: 'Experience', icon: FaBriefcase },
    { id: 'skills', label: 'Skills', icon: FaCode },
    { id: 'education', label: 'Education', icon: FaGraduationCap },
    { id: 'publications', label: 'Research', icon: FaBookOpen },
    { id: 'awards', label: 'Awards', icon: FaTrophy },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
          
          {/* Navigation Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30 }}
            className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 lg:hidden"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold text-gray-900">Navigation</h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FaTimes className="text-gray-600 text-lg" />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <motion.button
                      key={section.id}
                      onClick={() => {
                        document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                        onClose();
                      }}
                      className="w-full flex items-center space-x-3 p-4 rounded-xl hover:bg-gray-50 transition-colors text-left"
                      whileHover={{ x: 4 }}
                    >
                      <Icon className="text-gray-600 text-lg" />
                      <span className="text-gray-700 font-medium">{section.label}</span>
                    </motion.button>
                  );
                })}
              </nav>

              {/* Action Buttons */}
              <div className="absolute bottom-6 left-6 right-6 space-y-3">
                <Link to="/login">
                  <motion.button
                    className="w-full flex items-center justify-center space-x-2 p-4 border-2 border-gray-300 rounded-xl font-medium hover:border-black hover:text-black transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <CiLogin className="text-lg" />
                    <span>LOG IN</span>
                  </motion.button>
                </Link>
                
                <Link to="/contact">
                  <motion.button
                    className="w-full flex items-center justify-center space-x-2 p-4 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>CONTACT ME</span>
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Enhanced Floating Navigation with Scroll Progress
const FloatingNav = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const scrollProgress = useScrollProgress();
  
  const sections = [
    { id: 'home', label: 'Home', icon: FaUserGraduate },
    { id: 'experience', label: 'Experience', icon: FaBriefcase },
    { id: 'skills', label: 'Skills', icon: FaCode },
    { id: 'education', label: 'Education', icon: FaGraduationCap },
    { id: 'publications', label: 'Research', icon: FaBookOpen },
    { id: 'awards', label: 'Awards', icon: FaTrophy },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed top-6 right-6 z-50 lg:hidden bg-black text-white p-3 rounded-xl shadow-2xl"
        onClick={() => setIsMobileMenuOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaBars className="text-lg" />
      </motion.button>

      {/* Desktop Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="hidden lg:flex fixed top-24 right-6 transform z-50"
      >
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl px-4 py-3 shadow-2xl border border-gray-200">
          {/* Scroll Progress Bar */}
          <div className="absolute -bottom-1 -left-2 h-full w-0.5 bg-gray-200 rounded-full">
            <motion.div
              className="h-full bg-blue-600 rounded-full"
              initial={{ height: 0 }}
              animate={{ height: `${scrollProgress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          <div className="flex flex-col items-center space-y-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <motion.button
                  key={section.id}
                  onClick={() => {
                    document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                    setActiveSection(section.id);
                  }}
                  className={`relative p-3 rounded-xl transition-all duration-300 group ${
                    activeSection === section.id
                      ? 'bg-blue-600 text-white shadow-lg scale-110'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="text-sm" />
                  <span className="absolute -right-8 top-1/2 transform -translate-y-1/2 text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white px-2 py-1 rounded">
                    {section.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation */}
      <MobileNav isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
};

// Geometric Background Pattern
const GeometricBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-5 pointer-events-none">
      <div className="absolute top-0 left-0 w-full h-full">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute border border-gray-400"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 80 + 30}px`,
              height: `${Math.random() * 80 + 30}px`,
              rotate: Math.random() * 360,
            }}
            animate={{
              rotate: [0, 180, 360],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 20 + Math.random() * 20,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Enhanced Loading Screen
const LoadingScreen = memo(() => (
  <div className="fixed inset-0 bg-white flex items-center justify-center z-50 font-mono">
    <div className="text-center">
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="text-blue-600 text-6xl mb-4"
      >
        <FaUserGraduate />
      </motion.div>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 200 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        className="h-0.5 bg-gray-200 rounded-full mx-auto mb-4"
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="h-full bg-blue-600 rounded-full"
        />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-gray-600 font-light text-lg tracking-tight"
      >
        Initializing Professional Profile...
      </motion.p>
    </div>
  </div>
));

// Enhanced Header with Typography Focus
const Header = memo(({ user, token }) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 50]);
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);

  return (
    <header id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-white font-mono">
      <GeometricBackground />
      <FloatingNav />

      {/* Desktop Login Button */}
      <Link to='/login' className="hidden lg:block">
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="absolute top-8 right-8 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:border-black hover:text-black transition-all z-10"
        >
          <span className="tracking-wide">LOG_IN</span>
        </motion.button>
      </Link>
      
      {/* Animated Background Elements */}
      <motion.div style={{ y: y1 }} className="absolute top-20 left-10 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
      <motion.div style={{ y: y1 }} className="absolute bottom-20 right-10 w-64 h-64 bg-gray-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Column - Typographic Focus */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6 lg:space-y-8 text-center lg:text-left"
          >
            {/* Pre-title with ASCII art style */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center space-x-3 px-4 py-2 rounded-lg bg-black text-white"
            >
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium tracking-wider">PROFESSIONAL_PROFILE</span>
            </motion.div>

            {/* Main Title with Typewriter Effect */}
            <div className="space-y-4">
              <motion.h1
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight tracking-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {user.name.split('').map((char, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.1, delay: 0.6 + index * 0.05 }}
                    className="inline-block"
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="flex items-center justify-center lg:justify-start space-x-4 overflow-hidden"
              >
                <div className="w-8 lg:w-12 h-0.5 bg-blue-600 rounded-full"></div>
                <h2 className="text-lg lg:text-xl text-gray-600 font-light tracking-wide">{user.title}</h2>
              </motion.div>
            </div>

            {/* Summary with Code-like Formatting */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="bg-gray-50 p-4 lg:p-6 rounded-xl border-l-4 border-blue-600"
            >
              <div className="flex items-start space-x-3">
                <span className="text-blue-600 font-bold mt-1"></span>
                <p className="text-gray-700 leading-relaxed font-light text-sm lg:text-base">
                  {user.summary}
                </p>
              </div>
            </motion.div>

            {/* Key Metrics in Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
              className="grid grid-cols-3 gap-3 lg:gap-4 py-4 lg:py-6"
            >
              {[
                { value: 22 || 0, label: 'Years Exp', icon: FaBriefcase },
                { value: user.publications?.length || 0, label: 'Papers', icon: FaBookOpen },
                { value: user.awards?.length || 0, label: 'Awards', icon: FaTrophy },
              ].map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <div key={index} className="text-center p-3 lg:p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                    <Icon className="text-blue-600 text-base lg:text-lg mx-auto mb-1 lg:mb-2" />
                    <div className="text-lg lg:text-2xl font-bold text-gray-900">{metric.value}+</div>
                    <div className="text-xs text-gray-500 font-medium tracking-wide">{metric.label}</div>
                  </div>
                );
              })}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 }}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
            >
              <a href='https://res.cloudinary.com/dbzebdg6r/raw/upload/v1761293819/Melkamu_CV_June_2024_fo0e78.doc'>
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto flex items-center justify-center space-x-3 px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-all shadow-lg"
                >
                  <FaDownload className="text-sm" />
                  <span className="tracking-wide">DOWNLOAD_CV</span>
                </motion.button>
              </a>
              
              <Link to='/contact'>
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto flex items-center justify-center space-x-3 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:border-black hover:text-black transition-all"
                >
                  <span className="tracking-wide">CONTACT_ME</span>
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Column - Visual Impact */}
          <div className="relative order-first lg:order-last">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              {/* Main Image Container */}
              <div className="relative bg-white rounded-2xl p-3 lg:p-4 shadow-2xl border border-gray-200 mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-2 lg:-inset-4 bg-gradient-to-r from-blue-600 to-gray-900 rounded-2xl opacity-5"></div>
                <motion.img
                  src={user.profilePicture?.[user.profilePicture.length-1]?.imageUrl}
                  alt={user.name}
                  className="w-full h-64 lg:h-96 object-cover rounded-xl grayscale hover:grayscale-0 transition-all duration-500"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              
              {/* Status Badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -top-2 -right-2 lg:-top-3 lg:-right-3 bg-green-500 text-white px-3 py-1 lg:px-4 lg:py-2 rounded-lg shadow-lg"
              >
                <div className="flex items-center space-x-1 lg:space-x-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                  <span className="font-bold text-xs lg:text-sm tracking-wide">AVAILABLE</span>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
                className="absolute -bottom-2 -left-2 lg:-bottom-3 lg:-left-3 bg-white px-3 py-1 lg:px-4 lg:py-2 rounded-lg shadow-lg border border-gray-200"
              >
                <div className="flex items-center space-x-1 lg:space-x-2">
                  <FaStar className="text-yellow-500 text-xs lg:text-sm" />
                  <span className="font-semibold text-gray-700 text-xs lg:text-sm tracking-wide">EXPERT</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 hidden lg:block"
      >
        <div className="text-center space-y-3">
          <span className="text-sm text-gray-500 font-medium tracking-wide">SCROLL_TO_EXPLORE</span>
          <div className="w-5 h-8 border border-gray-300 rounded-full flex justify-center mx-auto">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-0.5 h-2 bg-gray-400 rounded-full mt-2"
            />
          </div>
        </div>
      </motion.div>
    </header>
  );
});

// Enhanced Experience Section with Terminal-like Design
const ExperienceSection = memo(({ experiences }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="experience" ref={ref} className="py-20 lg:py-32 bg-gray-950 text-white font-mono relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,#0f0f0f_25%,transparent_25%),linear-gradient(-45deg,#0f0f0f_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#0f0f0f_75%),linear-gradient(-45deg,transparent_75%,#0f0f0f_75%)] bg-[size:20px_20px] opacity-20"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12 lg:mb-20"
        >
          <div className="inline-flex items-center space-x-3 px-4 lg:px-6 py-2 lg:py-3 rounded-2xl bg-blue-600/20 border border-blue-500/30 mb-4 lg:mb-6">
            <FaBriefcase className="text-blue-400 text-sm lg:text-base" />
            <span className="text-xs lg:text-sm font-medium text-blue-300 tracking-wide">EXPERIENCE_TIMELINE</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">Career Journey</h2>
          <div className="w-20 lg:w-24 h-0.5 bg-blue-500 mx-auto mb-4"></div>
        </motion.div>

        {/* Terminal-style Timeline */}
        <div className="max-w-4xl mx-auto">
          {experiences?.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative pl-10 lg:pl-12 mb-6 lg:mb-8 group"
              onMouseEnter={() => setActiveIndex(index)}
            >
              {/* Timeline Indicator */}
              <div className={`absolute left-0 top-2 w-6 h-6 lg:w-8 lg:h-8 rounded-full border-2 transition-all duration-300 ${
                activeIndex === index 
                  ? 'bg-blue-500 border-blue-400 scale-110 lg:scale-125' 
                  : 'bg-gray-800 border-gray-600 group-hover:border-blue-400'
              }`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-xs font-bold transition-all duration-300 ${
                    activeIndex === index ? 'text-white' : 'text-gray-400'
                  }`}>
                    {index + 1}
                  </span>
                </div>
              </div>

              {/* Content Card */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                className={`bg-gray-900 border-l-4 rounded-r-2xl p-4 lg:p-6 transition-all duration-300 ${
                  activeIndex === index 
                    ? 'border-blue-500 shadow-xl lg:shadow-2xl bg-gray-800' 
                    : 'border-gray-700 hover:border-blue-400'
                }`}
              >
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-3 lg:mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg lg:text-xl font-bold text-white mb-1 lg:mb-2 tracking-wide">{exp.position}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-sm">
                      <span className="text-blue-400 font-medium bg-blue-500/20 px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm">
                        {exp.institution}
                      </span>
                      <span className="text-gray-400 text-xs lg:text-sm">
                        {exp.startDate ? `${new Date(exp.startDate).getFullYear()} - ${exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'}` : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-300 leading-relaxed mb-3 lg:mb-4 text-sm lg:text-base tracking-wide">{exp.description}</p>

                {/* Skills Tags */}
                {exp.skills && (
                  <div className="flex flex-wrap gap-1 lg:gap-2">
                    {exp.skills.split(',').slice(0, 4).map((skill, i) => (
                      <span 
                        key={i}
                        className="px-2 lg:px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs font-medium border border-gray-700 tracking-wide"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

// Enhanced Skills Section with Level Indicators
const SkillsSection = memo(({ skills }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const SkillLevel = ({ level }) => {
    const getLevelConfig = (level) => {
      const levels = {
        'Expert': { color: 'bg-green-500', width: 'w-32', dots: 5 },
        'Advanced': { color: 'bg-blue-500', width: 'w-24', dots: 4 },
        'Intermediate': { color: 'bg-yellow-500', width: 'w-20', dots: 3 },
        'Beginner': { color: 'bg-gray-400', width: 'w-16', dots: 2 },
        'Novice': { color: 'bg-gray-300', width: 'w-12', dots: 1 }
      };
      return levels[level] || levels['Beginner'];
    };

    const config = getLevelConfig(level);

    return (
      <div className="flex items-center space-x-2">
        <div className="flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full ${
                i < config.dots ? config.color : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <span className="text-xs lg:text-sm font-medium text-gray-600 tracking-wide">{level}</span>
      </div>
    );
  };

  const TechnicalSkills = skills?.filter(skill => 
    !['English', 'Amharic', 'French', 'Arabic'].includes(skill.skill)
  );

  return (
    <section id="skills" ref={ref} className="py-20 lg:py-32 bg-white font-mono relative overflow-hidden">
      <GeometricBackground />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12 lg:mb-20"
        >
          <div className="inline-flex items-center space-x-3 px-4 lg:px-6 py-2 lg:py-3 rounded-2xl bg-black text-white mb-4 lg:mb-6">
            <FaCode className="text-green-400 text-sm lg:text-base" />
            <span className="text-xs lg:text-sm font-medium tracking-wide">TECHNICAL_SKILLS</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Core Competencies</h2>
          <div className="w-20 lg:w-24 h-0.5 bg-black mx-auto mb-4"></div>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 max-w-6xl mx-auto">
          {TechnicalSkills?.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-white p-4 lg:p-6 rounded-xl lg:rounded-2xl border-2 border-gray-100 hover:border-black transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              {/* Skill Header */}
              <div className="flex items-center justify-between mb-3 lg:mb-4">
                <h3 className="text-base lg:text-lg font-bold text-gray-900 tracking-wide group-hover:text-black line-clamp-1">
                  {skill.skill}
                </h3>
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-black transition-colors flex-shrink-0 ml-2">
                  <FaTools className="text-gray-600 group-hover:text-white transition-colors text-sm lg:text-base" />
                </div>
              </div>

              {/* Skill Level */}
              <SkillLevel level={skill.level} />

              {/* Progress Bar */}
              <div className="mt-3 lg:mt-4">
                <div className="w-full bg-gray-200 rounded-full h-1.5 lg:h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={inView ? { 
                      width: skill.level === 'Expert' ? '100%' : 
                             skill.level === 'Advanced' ? '80%' : 
                             skill.level === 'Intermediate' ? '60%' : 
                             skill.level === 'Beginner' ? '40%' : '20%'
                    } : {}}
                    transition={{ duration: 1, delay: index * 0.2 }}
                    className={`h-1.5 lg:h-2 rounded-full ${
                      skill.level === 'Expert' ? 'bg-green-500' :
                      skill.level === 'Advanced' ? 'bg-blue-500' :
                      skill.level === 'Intermediate' ? 'bg-yellow-500' :
                      'bg-gray-400'
                    }`}
                  />
                </div>
              </div>

              {/* Description */}
              {skill.description && (
                <p className="mt-3 lg:mt-4 text-xs lg:text-sm text-gray-600 leading-relaxed tracking-wide line-clamp-2">
                  {skill.description}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

// Enhanced Education Section with Academic Style
const EducationSection = memo(({ educations }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="education" ref={ref} className="py-20 lg:py-32 bg-gray-50 font-mono relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12 lg:mb-20"
        >
          <div className="inline-flex items-center space-x-3 px-4 lg:px-6 py-2 lg:py-3 rounded-2xl bg-purple-600 text-white mb-4 lg:mb-6">
            <FaGraduationCap className="text-sm lg:text-base" />
            <span className="text-xs lg:text-sm font-medium tracking-wide">ACADEMIC_CREDENTIALS</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Education</h2>
          <div className="w-20 lg:w-24 h-0.5 bg-purple-600 mx-auto mb-4"></div>
        </motion.div>

        {/* Education Cards */}
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-6 max-w-6xl mx-auto">
          {educations?.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.01, y: -2 }}
              className="bg-white p-4 lg:p-6 rounded-xl lg:rounded-2xl border-2 border-gray-200 hover:border-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4 lg:mb-6">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-xl lg:rounded-2xl flex items-center justify-center group-hover:bg-purple-600 transition-colors flex-shrink-0">
                  <FaGraduationCap className="text-purple-600 group-hover:text-white text-lg lg:text-xl transition-colors" />
                </div>
                <span className="text-xs lg:text-sm text-gray-500 bg-gray-100 px-2 lg:px-3 py-1 rounded-full font-medium ml-4">
                  {edu.graduationDate ? new Date(edu.graduationDate).getFullYear() : 'N/A'}
                </span>
              </div>

              {/* Content */}
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2 lg:mb-3 tracking-wide group-hover:text-purple-600 transition-colors line-clamp-2">
                {edu.degree}
              </h3>
              <p className="text-purple-600 font-semibold text-base lg:text-lg mb-3 lg:mb-4 tracking-wide line-clamp-1">
                {edu.institution}
              </p>
              
              <div className="space-y-2 lg:space-y-3 text-gray-600">
                <p className="font-medium tracking-wide text-sm lg:text-base">{edu.fieldOfStudy}</p>
                
                {edu.thesis && (
                  <div className="pt-3 lg:pt-4 border-t border-gray-200">
                    <p className="text-xs lg:text-sm text-gray-500 italic tracking-wide line-clamp-2">
                      <span className="font-semibold">Thesis:</span> {edu.thesis}
                    </p>
                  </div>
                )}

                {edu.gpa && (
                  <div className="flex items-center space-x-2 text-xs lg:text-sm">
                    <span className="font-semibold">GPA:</span>
                    <span className="bg-gray-100 px-2 py-1 rounded">{edu.gpa}</span>
                  </div>
                )}
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-xl lg:rounded-2xl border-2 border-transparent bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300 -z-10"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

// Enhanced Publications Section with Show More
const PublicationsSection = memo(({ publications }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [showAll, setShowAll] = useState(false);
  const initialDisplayCount = 4;

  const displayedPublications = showAll ? publications : publications?.slice(0, initialDisplayCount);

  return (
    <section id="publications" ref={ref} className="py-20 lg:py-32 bg-white font-mono relative overflow-hidden">
      <GeometricBackground />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12 lg:mb-20"
        >
          <div className="inline-flex items-center space-x-3 px-4 lg:px-6 py-2 lg:py-3 rounded-2xl bg-blue-600 text-white mb-4 lg:mb-6">
            <FaBookOpen className="text-sm lg:text-base" />
            <span className="text-xs lg:text-sm font-medium tracking-wide">RESEARCH_PUBLICATIONS</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Publications</h2>
          <div className="w-20 lg:w-24 h-0.5 bg-blue-600 mx-auto mb-4"></div>
        </motion.div>

        {/* Publications Grid */}
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-6 max-w-6xl mx-auto">
          {displayedPublications?.map((pub, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.01, y: -2 }}
              className="bg-gray-50 p-4 lg:p-6 rounded-xl lg:rounded-2xl border-2 border-gray-200 hover:border-blue-600 transition-all duration-300 group"
            >
              {/* Publication Header */}
              <div className="flex items-start justify-between mb-3 lg:mb-4">
                <div className="flex-1">
                  <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-2 lg:mb-3 leading-tight tracking-wide group-hover:text-blue-600 transition-colors line-clamp-2">
                    {pub.title}
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-2 text-xs lg:text-sm text-gray-600 mb-3 lg:mb-4">
                    <span className="font-semibold bg-blue-100 text-blue-700 px-2 lg:px-3 py-1 rounded-full">
                      {pub.journal}
                    </span>
                    {pub.volume && (
                      <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded">Vol. {pub.volume}</span>
                    )}
                    {pub.year && (
                      <span className="text-gray-500 font-medium">{pub.year}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Publication Details */}
              {pub.description && (
                <p className="text-gray-700 leading-relaxed mb-3 lg:mb-4 text-xs lg:text-sm tracking-wide line-clamp-3">
                  {pub.description}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 lg:pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2 lg:space-x-4 text-xs text-gray-500">
                  {pub.pages && <span>Pages: {pub.pages}</span>}
                  {(pub.doi || pub.url) && (
                    <span className="font-mono text-xs truncate max-w-20 lg:max-w-none">
                      DOI: {(pub.doi || pub.url).slice(0, 20)}...
                    </span>
                  )}
                </div>
                
                {(pub.doi || pub.url) && (
                  <motion.a
                    href={pub.doi || pub.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 lg:space-x-2 text-blue-600 hover:text-blue-700 font-medium px-3 lg:px-4 py-1 lg:py-2 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors text-xs lg:text-sm flex-shrink-0"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="tracking-wide">VIEW</span>
                    <FaExternalLinkAlt className="text-xs" />
                  </motion.a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Show More/Less Button */}
        {publications && publications.length > initialDisplayCount && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-8 lg:mt-12"
          >
            <motion.button
              onClick={() => setShowAll(!showAll)}
              className="flex items-center justify-center space-x-2 lg:space-x-3 bg-black text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl lg:rounded-2xl font-medium hover:bg-gray-800 transition-colors mx-auto text-sm lg:text-base"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="tracking-wide">
                {showAll ? 'SHOW_LESS' : `SHOW_ALL_${publications.length}_PUBLICATIONS`}
              </span>
              {showAll ? <FaChevronUp className="text-xs lg:text-sm" /> : <FaChevronDown className="text-xs lg:text-sm" />}
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  );
});

// Enhanced Awards Section with Medal Design
const AwardsSection = memo(({ awards }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="awards" ref={ref} className="py-20 lg:py-32 bg-gray-950 text-white font-mono relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-yellow-400 opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 8 + Math.random() * 8,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          >
            <FaTrophy className="text-2xl lg:text-4xl" />
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12 lg:mb-20"
        >
          <div className="inline-flex items-center space-x-3 px-4 lg:px-6 py-2 lg:py-3 rounded-2xl bg-yellow-600/20 border border-yellow-500/30 mb-4 lg:mb-6">
            <FaTrophy className="text-yellow-400 text-sm lg:text-base" />
            <span className="text-xs lg:text-sm font-medium text-yellow-300 tracking-wide">AWARDS_HONORS</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">Achievements</h2>
          <div className="w-20 lg:w-24 h-0.5 bg-yellow-500 mx-auto mb-4"></div>
        </motion.div>

        {/* Awards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 max-w-6xl mx-auto">
          {awards?.map((award, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, rotateY: 5 }}
              className="relative group"
            >
              {/* Medal Design */}
              <div className="absolute -top-2 -right-2 lg:-top-4 lg:-right-4 z-20">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-xl lg:shadow-2xl"
                >
                  <FaMedal className="text-white text-sm lg:text-base" />
                </motion.div>
              </div>

              {/* Content Card */}
              <div className="bg-gray-900 rounded-xl lg:rounded-2xl p-4 lg:p-6 border-2 border-gray-800 hover:border-yellow-500 transition-all duration-300 h-full relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  <div className="text-center">
                    <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4 group-hover:scale-105 transition-transform duration-300">
                      <FaTrophy className="text-white text-lg lg:text-xl" />
                    </div>
                    
                    <h3 className="text-lg lg:text-xl font-bold text-white mb-2 lg:mb-3 tracking-wide leading-tight line-clamp-2">
                      {award.title}
                    </h3>
                    <p className="text-yellow-400 font-semibold text-base lg:text-lg mb-2 lg:mb-3 tracking-wide line-clamp-1">
                      {award.institution}
                    </p>
                    <p className="text-gray-300 leading-relaxed mb-3 lg:mb-4 text-xs lg:text-sm tracking-wide line-clamp-3">
                      {award.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs lg:text-sm text-gray-400">{award.year}</span>
                      <span className="inline-flex items-center px-2 lg:px-3 py-1 bg-yellow-600/20 text-yellow-300 rounded-full text-xs font-medium border border-yellow-500/30">
                        {award.type || 'Excellence'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

// Enhanced Footer
const Footer = ({ user }) => {
  return (
    <footer className="bg-black text-white py-12 lg:py-20 font-mono relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,#fff_50%,transparent_52%)] bg-[size:20px_20px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Column */}
          <div className="space-y-4 lg:space-y-6 text-center lg:text-left">
            <h3 className="text-2xl lg:text-3xl font-bold tracking-tight">
              LET'S_CREATE_
              <span className="text-blue-400">TOGETHER</span>
            </h3>
            <p className="text-gray-300 leading-relaxed max-w-md tracking-wide text-sm lg:text-base mx-auto lg:mx-0">
              Ready to collaborate on innovative projects and groundbreaking ideas?
              <br className="hidden lg:block" />
              Let's build something extraordinary.
            </p>
            
            <div className="flex justify-center lg:justify-start space-x-2 lg:space-x-3">
              {[
                { Icon: FaEnvelope, link: `mailto:${user.contact?.email}`, label: 'Email' },
                { Icon: FaLinkedin, link: "https://linkedin.com", label: 'LinkedIn' },
                { Icon: FaTwitter, link: "https://twitter.com", label: 'Twitter' },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.link}
                  className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-blue-600 transition-colors border border-white/20"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  title={social.label}
                >
                  <social.Icon className="text-sm lg:text-base" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Right Column - Contact Info */}
          <div className="bg-white/10 rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-white/20 backdrop-blur-lg">
            <h4 className="text-base lg:text-lg font-bold mb-4 lg:mb-6 tracking-wide">CONTACT_INFO</h4>
            <div className="space-y-3 lg:space-y-4">
              <div className="flex items-center space-x-3 lg:space-x-4 p-2 lg:p-3 rounded-lg lg:rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-600 rounded-lg lg:rounded-xl flex items-center justify-center flex-shrink-0">
                  <FaEnvelope className="text-white text-xs lg:text-sm" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-400 tracking-wide">EMAIL</p>
                  <p className="text-white font-medium tracking-wide text-sm lg:text-base truncate">{user.contact?.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 lg:space-x-4 p-2 lg:p-3 rounded-lg lg:rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-green-600 rounded-lg lg:rounded-xl flex items-center justify-center flex-shrink-0">
                  <FaPhone className="text-white text-xs lg:text-sm" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-400 tracking-wide">PHONE</p>
                  <p className="text-white font-medium tracking-wide text-sm lg:text-base">{user.contact?.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 lg:space-x-4 p-2 lg:p-3 rounded-lg lg:rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-purple-600 rounded-lg lg:rounded-xl flex items-center justify-center flex-shrink-0">
                  <FaMapMarkerAlt className="text-white text-xs lg:text-sm" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-400 tracking-wide">LOCATION</p>
                  <p className="text-white font-medium tracking-wide text-sm lg:text-base">{`${user.contact?.city}, ${user.contact?.country}`}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-8 lg:mt-12 pt-6 lg:pt-8 text-center">
          <p className="text-gray-400 text-xs lg:text-sm tracking-wide">
            &copy; {new Date().getFullYear()} {user.name}. ALL_RIGHTS_RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
};

// Main Component
const ProfessionalProfile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const { token } = useContext(AppContext);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(`${apiUrl}/get-all`);
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="bg-white font-mono">
      <Header user={user} token={token} />
      <ExperienceSection experiences={user?.experiences} />
      <SkillsSection skills={user?.skills} />
      <EducationSection educations={user?.educations} />
      <PublicationsSection publications={user?.publications} />
      <AwardsSection awards={user?.awards} />
      <Footer user={user} />
    </div>
  );
};

export default ProfessionalProfile;