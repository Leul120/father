

import { useState, useEffect, useContext, memo } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  FaUserGraduate, FaBriefcase, FaAward, FaLanguage,
  FaCertificate, FaEnvelope, FaPhone, FaGlobe,
  FaChevronDown, FaLinkedin, FaTwitter, FaExternalLinkAlt,
  FaMedal, FaBookOpen, FaGlobeAmericas, FaFacebook,
  FaRegEdit
} from 'react-icons/fa';
import { 
  SiJavascript, SiPython, SiReact, SiNodedotjs, SiDocker 
} from 'react-icons/si';
import { CiLogin } from "react-icons/ci";
import { Upload } from 'antd';
import { AppContext } from './App';

const apiUrl = import.meta.env.VITE_API_URL;
// Memoized Components
const ContactIcon = memo(({ Icon, text }) => (
  <motion.div
    className="flex items-center space-x-2"
    whileHover={{ scale: 1.1 }}
    transition={{ duration: 0.2 }}
  >
    <Icon className="text-xl" />
    <span>{text}</span>
  </motion.div>
));

const SocialButton = memo(({ Icon, link }) => (
  <motion.a
    href={link}
    className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-blue-900 transition-colors duration-300"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
  >
    <Icon className="text-xl" />
  </motion.a>
));

const LoadingScreen = memo(() => (
  <div className="fixed inset-0 bg-gradient-to-b from-blue-900 to-black flex items-center justify-center">
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        rotate: [0, 360]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="text-white text-4xl"
    >
      <FaUserGraduate />
    </motion.div>
  </div>
));

// Skill Icon mapping
const skillIconMap = {
  'JavaScript': SiJavascript,
  'Python': SiPython,
  'React': SiReact,
  'Node.js': SiNodedotjs,
  'Docker': SiDocker
};

const SkillIcon = memo(({ skill }) => {
  const Icon = skillIconMap[skill] || FaAward;
  return <Icon className="text-2xl" />;
});

const Section = memo(({ title, Icon, children }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      <div className="flex items-center space-x-4 mb-12">
        <Icon className="text-3xl text-blue-400" />
        <h2 className="text-3xl font-bold">{title}</h2>
      </div>
      {children}
    </motion.section>
  );
});

const Header = memo(({ user, token }) => {
  if (!user) return null;

  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900 to-black opacity-90" />
      <a href="/login">
        <div className="text-yellow-600 text-2xl absolute top-3 right-3">
          <CiLogin />
        </div>
      </a>
      <a href="/contact" className="text-white border p-1 rounded-md absolute top-3 left-3">
        
          contact me
       
      </a>
      <div className="relative z-10 text-white text-center space-y-6 max-w-4xl px-4">
        <div className="relative w-48 h-48 mx-auto group ">
          <motion.img
            src={user.profilePicture[user.profilePicture.length-1].imageUrl}
            alt={user.name}
            className="w-full h-full rounded-full shadow-xl border-4 border-white "
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
            loading='lazy'
          />
          {token && (
            <motion.div
              className="absolute bottom-3 left-24 transform -translate-x-1/2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 text-white rounded-full p-2 shadow-md cursor-pointer transition-all duration-300"
              whileHover={{ scale: 1.2 }}
            >
              <Upload><FaRegEdit /></Upload>
            </motion.div>
          )}
        </div>
        <motion.h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          {user.name}
        </motion.h1>

        <motion.h2 className="text-2xl text-blue-200">
          {user.title}
        </motion.h2>

        <div className="flex space-x-6 justify-center text-blue-200 flex-wrap">
          <ContactIcon Icon={FaEnvelope} text={user.contact?.email} />
          <ContactIcon Icon={FaPhone} text={user.contact?.phone} />
          <ContactIcon Icon={FaGlobe} text={`${user.contact?.city}, ${user.contact?.country}`} />
        </div>

        <div className="flex space-x-4 justify-center mt-6">
          <SocialButton Icon={FaFacebook} link="#" />
          <SocialButton Icon={FaLinkedin} link="https://www.linkedin.com/in/dr-melkamu-bezabih-yitbarek-15b1797a/" />
          <SocialButton Icon={FaTwitter} link="https://x.com/DrMelkamu" />
        </div>
      </div>

      <motion.div
        className="absolute bottom-10 text-white cursor-pointer"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        onClick={() => document.getElementById('content').scrollIntoView({ behavior: 'smooth' })}
      >
        <FaChevronDown className="text-3xl" />
      </motion.div>
    </motion.header>
  );
});

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
    <div className="bg-gradient-to-b from-gray-900 to-black min-h-screen text-white">
      <Header user={user} token={token} />
      
      <main id="content" className="max-w-7xl mx-auto px-4 py-20 space-y-32">
        <Section title="Summary" Icon={FaUserGraduate}>
          <p className="text-lg leading-relaxed text-gray-300">{user?.summary}</p>
        </Section>
        <Section title="Education" Icon={FaUserGraduate}>
          <Timeline data={user?.educations} />
        </Section>
        <Section title="Experience" Icon={FaBriefcase}>
          <Timeline data={user?.experiences} />
        </Section>
        <Section title="Awards" Icon={FaMedal}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {user?.awards?.map((award, index) => (
              <AwardCard key={index} award={award} index={index} />
            ))}
          </div>
        </Section>
        <Section title="Certificates" Icon={FaCertificate}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user?.certificates?.map((cert, index) => (
              <CertificateCard key={index} certificate={cert} index={index} />
            ))}
          </div>
        </Section>

        <Section title="Skills" Icon={FaAward}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {user?.skills?.map((skill, index) => (
              <SkillCard key={index} skill={skill} />
            ))}
          </div>
        </Section>
        <Section title="Publications" Icon={FaBookOpen}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {user?.publications?.map((pub, index) => (
              <PublicationCard key={index} publication={pub} index={index} />
            ))}
          </div>
        </Section>

        <Section title="Languages" Icon={FaGlobeAmericas}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user?.languages?.map((lang, index) => (
              <LanguageCard key={index} language={lang} index={index} />
            ))}
          </div>
        </Section>
      </main>
    </div>
  );
};

// Optimized Card Components
const SkillCard = memo(({ skill }) => {
  const [ref, inView] = useInView({ triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6 }}
      className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center"
      whileHover={{ scale: 1.05 }}
    >
      <SkillIcon skill={skill.skill} />
      <h3 className="mt-4 text-lg font-semibold">{skill.skill}</h3>
    </motion.div>
  );
});

const CertificateCard = memo(({ certificate, index }) => {
  const [ref, inView] = useInView({ triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.03 }}
      className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/15 transition-colors duration-300"
    >
      <div className="flex items-center space-x-4">
        <FaCertificate className="text-3xl text-yellow-400" />
        <div>
          <h3 className="text-xl font-semibold">{certificate.title}</h3>
          <p className="text-gray-400">{certificate.institution}</p>
        </div>
      </div>
      <p className="mt-4 text-gray-300">{certificate.description}</p>
      <p className="mt-2 text-sm text-gray-400">
        {new Date(certificate.date).toLocaleDateString()||""}
      </p>
    </motion.div>
  );
});

const AwardCard = ({ award, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0, x: -50 },
        visible: { 
          opacity: 1, 
          x: 0,
          transition: { 
            duration: 0.6,
            delay: index * 0.2
          }
        }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-xl p-6 overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-purple-500/20"
        initial={false}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      <div className="relative z-10">
        <div className="flex items-center space-x-4">
          <FaAward className="text-4xl text-yellow-400" />
          <div>
            <h3 className="text-xl font-semibold">{award.title}</h3>
            <p className="text-gray-400">{award.institution}</p>
          </div>
        </div>
        <p className="mt-4 text-gray-300">{award.description}</p>
        <p className="mt-2 text-sm text-yellow-400">{award.year}</p>
      </div>
    </motion.div>
  );
};

const PublicationCard = ({ publication, index }) => {
  const [ref, inView] = useInView({ 
    threshold: 0.1, 
    triggerOnce: true 
  });

  return (
    <motion.div 
      ref={ref} 
      initial="hidden" 
      animate={inView ? "visible" : "hidden"} 
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { 
          opacity: 1, 
          y: 0, 
          transition: { 
            duration: 0.6, 
            delay: index * 0.15 
          } 
        }
      }} 
      className="bg-white/5 rounded-xl p-4 sm:p-6 hover:bg-white/10 transition-colors duration-300 w-full" 
    >
      <div className="flex flex-col sm:flex-row justify-between items-start space-y-4 sm:space-y-0">
        <div className="flex-1 w-full">
          <h3 className="text-lg sm:text-xl font-semibold text-blue-400">
            {publication.title}
          </h3>
          <p className="mt-2 text-gray-400 text-sm sm:text-base">
            {publication.journal}
          </p>
          <div className="flex flex-wrap items-center space-x-2 sm:space-x-4 mt-2">
            <span className="text-xs sm:text-sm text-gray-500">
              Volume: {publication.volume}
            </span>
            <span className="text-xs sm:text-sm text-gray-500">
              Pages: {publication.pages}
            </span>
            <span className="text-xs sm:text-sm text-gray-500">
              {publication.year}
            </span>
          </div>
        </div>
        <motion.button 
          whileHover={{ scale: 1.1 }} 
          whileTap={{ scale: 0.95 }} 
          onClick={() => window.open(publication.doi, '_blank')} 
          className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 mt-2 sm:mt-0"
        >
          <FaExternalLinkAlt />
          <span className="text-sm">DOI</span>
        </motion.button>
      </div>
    </motion.div>
  );
};


const LanguageCard = ({ language, index }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const getProficiencyColor = (proficiency) => {
    const levels = {
      'Native': 'from-green-500 to-green-700',
      'Fluent': 'from-blue-500 to-blue-700',
      'Advanced': 'from-purple-500 to-purple-700',
      'Intermediate': 'from-yellow-500 to-yellow-700',
      'Basic': 'from-red-500 to-red-700'
    };
    return levels[proficiency] || 'from-gray-500 to-gray-700';
  };

  const getProficiencyWidth = (proficiency) => {
    const levels = {
      'Native': 'w-full',
      'Fluent': 'w-4/5',
      'Advanced': 'w-3/4',
      'Intermediate': 'w-1/2',
      'Basic': 'w-1/4'
    };
    return levels[proficiency] || 'w-1/4';
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0, scale: 0.8 },
        visible: { 
          opacity: 1, 
          scale: 1,
          transition: { 
            duration: 0.6,
            delay: index * 0.1
          }
        }
      }}
      whileHover={{ scale: 1.05 }}
      className="bg-white/5 rounded-xl p-6"
    >
      <div className="flex items-center space-x-4 mb-4">
        <FaLanguage className="text-2xl text-blue-400" />
        <h3 className="text-xl font-semibold">{language.language}</h3>
      </div>
      
      <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1, delay: 0.5 }}
          className={`absolute h-full bg-gradient-to-r ${getProficiencyColor(language.proficiency)}`}
          style={{ width: getProficiencyWidth(language.proficiency) }}
        />
      </div>
      
      <p className="mt-2 text-sm text-gray-400 text-center">
        {language.proficiency}
      </p>
    </motion.div>
  );
};

const Timeline = memo(({ data }) => (
  <div className="space-y-12">
    {data?.map((item, index) => (
      <TimelineItem key={index} item={item} index={index} />
    ))}
  </div>
));

const TimelineItem = memo(({ item, index }) => {
  const [ref, inView] = useInView({ triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -50 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="relative pl-8 border-l-2 border-blue-400"
    >
      <div className="absolute left-0 top-0 w-4 h-4 -translate-x-1/2 bg-blue-400 rounded-full" />
      <h3 className="text-xl font-semibold">{item.title || item.degree||item.position}</h3>
      <p className="text-gray-400">{item.institution}</p>
      <p className="text-gray-500">
        {item.startDate
          ? `${new Date(item.startDate).getFullYear()} - ${
              item.endDate !== null
                ? new Date(item.endDate).getFullYear()
                : "Present"
            }`
          : new Date(item.graduationDate).toLocaleDateString()}
      </p>
      <p className="mt-2 text-gray-300">{item.description || item.thesis}</p>
    </motion.div>
  );
});

export default ProfessionalProfile;