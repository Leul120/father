// import React, { useEffect, useState } from "react";
// import "tailwindcss/tailwind.css";
// import { Card, List, Typography, Space, Progress, Divider, Avatar, Tag, Button, Modal, Descriptions } from "antd";
// import { PhoneOutlined, MailOutlined, GlobalOutlined, UserOutlined, LoadingOutlined } from "@ant-design/icons";
// import { motion, useAnimation } from "framer-motion";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import { useInView } from "react-intersection-observer";
// import gsap from "gsap";
// import VerticalNavbar from "./Navigation";
// import './App.css'
// import { useNavigate } from "react-router-dom";
// import pic from './Dr._Melkamus_Photo_.jpg'
// import {Mosaic, Riple} from 'react-loading-indicators'
// const { Title, Text, Paragraph } = Typography;

// const ProfessionalProfile = () => {
//   const token = window.localStorage.getItem('token');
//   const [user, setUser] = useState({});
//   const [background, setBackground] = useState("bg1");
//   const [loading,setLoading]=useState(false)

//   useEffect(() => {
//     fetchUser();
//     animateListItems();
//   }, []);

//   const fetchUser = async () => {
//     try {
//       setLoading(true)
//       const response = await axios.get(`${process.env.REACT_APP_URL}/get-user/66aa66a88308517ab913076b`);
//       setUser(response.data.user);
//       setLoading(false)
//     } catch (error) {
//       console.log(error);
//       setLoading(false)
//     }
//   };
  

//   const animateListItems = () => {
//     gsap.utils.toArray(".list-item").forEach(item => {
//       gsap.fromTo(item, 
//         { opacity: 0, y: 30 }, 
//         { opacity: 1, y: 0, duration: 0.6, scrollTrigger: { trigger: item, start: "top 80%" } }
//       );
//     });
//   };
// const navigate=useNavigate()
//   const handleIntersection = (inView, entry, backgroundClass) => {
//     if (inView) {
//       setBackground(backgroundClass);
//     }
//   };

//   const Section = ({ title, children, backgroundClass }) => {
//     const { ref, inView } = useInView({
//       threshold: 0.3, // Trigger when 30% of the section is in view
//       triggerOnce: true,
//     });

//     useEffect(() => {
//       handleIntersection(inView, ref, backgroundClass);
//     }, [inView, ref, backgroundClass]);

//     return (
//       <div ref={ref} className=" p-8">
//         <Divider>
//           <Title level={3} className="text-indigo-600">
//             {title}
//           </Title>
//         </Divider>
//         {children}
//       </div>
//     );
//   };

//   const HeaderSection = ({ name, title, contact }) => (
//     <div className="flex flex-col items-center justify-center text-center space-y-4">
//       <Avatar size={150}  src={pic} />
//       <motion.div
//         initial={{ opacity: 0, y: -30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//       >
//         <Title level={2} className="text-4xl text-white mt-4 mb-2">
//           {name}
//         </Title>
//       </motion.div>
//       <Text className="text-xl ">{title}</Text>
//       <div className="flex space-x-4 mt-2 text-white">
//         <Text>
//           <PhoneOutlined className="mr-2" />
//           {contact?.phone}
//         </Text>
//         <Text>
//           <MailOutlined className="mr-2" />
//           {contact?.email}
//         </Text>
//         <Text>
//           <GlobalOutlined className="mr-2" />
//           {contact?.institution}, {contact?.city}, {contact?.country}
//         </Text>
//       </div>
//     </div>
//   );

//   return (
//     <div className={`min-h-screen pt-4 relative nineth p-2 overflow-hidden ${background} transition-all duration-500`}>
    
//       {token && <VerticalNavbar />}
//       <div className="absolute inset-0 -z-10 transition-transform duration-500">
//         <div className="w-full  h-full opacity-40"></div>
//       </div>
//       <motion.div
//         className="relative z-10"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.8 }}
//       >
//         <div className="shadow-lg rounded-lg overflow-hidden">
//           <div>
//           <Button onClick={()=>navigate('/contact-us')} className="   float-start  rounded-lg fixed cursor-pointer">Contact Me</Button>
//             <HeaderSection name={user?.name} title={user?.title} contact={user?.contact} />

//             <Section title="Summary" backgroundClass="bg1">
//               <motion.div
//                 initial={{ opacity: 0, x: -30 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.6 }}
//                 className="hover:scale-105 transition-transform duration-300"
//               >
//                 <Paragraph className="text-center">{user?.summary}</Paragraph>
//               </motion.div>
//             </Section>
//     <Section title="Education" backgroundClass="bg4">
//               <List
//                 itemLayout="vertical"
//                 dataSource={user?.educations}
//                 renderItem={(item) => (
//                   <div className="list-item">
//                     <List.Item>
//                       <Title level={4}>{item.degree}</Title>
//                       <Text>{item.field}</Text>
//                       <Text>{item.institution}, {item.location}</Text><br />
//                       <Text>{new Date(item.graduationDate).toLocaleDateString()}</Text>
//                       <Paragraph>GPA: {item.gpa}</Paragraph>
//                       <Paragraph> {item.thesis}</Paragraph>
//                     </List.Item>
//                   </div>
//                 )}
//               />
//             </Section>
//             <Section title="Experiences" backgroundClass="bg2">
//               <List
//                 itemLayout="vertical"
//                 dataSource={user?.experiences}
//                 renderItem={(item) => (
//                   <div className="list-item">
//                     <List.Item>
//                       <Title level={4}>{item.position}</Title>
//                       <Text>{item.institution}, {item.location}</Text>
//                       <Paragraph>{item.description}</Paragraph>
//                       <Text type="secondary">
//                       {console.log(item.endDate)}
//                         {new Date(item.startDate).toLocaleDateString()} - {item.endDate!=="1800-07-16T00:00:00.000Z"? new Date(item.endDate).toLocaleDateString() : "Present"}
//                       </Text>
//                     </List.Item>
//                   </div>
//                 )}
//               />
//             </Section>

//             <Section title="Skills" backgroundClass="bg3">
//               <Space wrap>
//                 {user?.skills?.map((skill, index) => (
//                   <motion.div
//                     key={index}
//                     initial={{ opacity: 0, scale: 0.8 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     transition={{ duration: 0.6 }}
//                     whileHover={{ scale: 1.1, rotate: 10 }}
//                     className="cursor-pointer"
//                   >
//                     <Tag color="" className="p-3 text-lg bg-slate-300 rounded-3xl">{skill.skill}</Tag>
//                   </motion.div>
//                 ))}
//               </Space>
//             </Section>

            

//             <Section title="Languages" backgroundClass="bg5">
//               <div
//                 itemLayout="horizontal"
//                 className="flex flex-row"
//                 >
//                 {user?.languages?.map((item) => (
//                   <div className="">
//                     <span>
//                       <Tag color="blue" className="p-3 text-lg rounded-xl">{item.language}
//                       <div className="text-sm text-stone-500">{item.proficiency}</div>
//                       </Tag>
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </Section>

//          <Section title="Certificates" backgroundClass="bg6">
//   <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
//     {user?.certificates?.map((item, index) => (
//       <div key={index} className="list-item mb-6 m-2" style={{ listStyle: 'none' }}>
//         <div className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
//           <Title level={4} className="text-xl font-semibold text-gray-800 hover:text-blue-600">{item.title}</Title>
//           <Text className="text-gray-600">{item.institution}</Text>
//           <Text className="text-gray-500 text-sm block">{new Date(item.date).toLocaleDateString()}</Text>
//           <Paragraph className="mt-2 text-gray-700">{item.description}</Paragraph>
//         </div>
//       </div>
//     ))}
//   </div>
// </Section>

//             <Section title="Awards" backgroundClass="bg7">
//   <List
//     itemLayout="vertical"
//     dataSource={user?.awards}
//     renderItem={(item) => (
//       <div className="list-item mb-6">
//         <List.Item>
//           <div className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
//             <Title level={4} className="text-xl font-semibold text-gray-800 hover:text-blue-600">{item.title}</Title>
//             <Text className="text-gray-600">{item.institution}</Text>
//             <Text className="text-gray-500 text-sm block">{item.year}</Text>
//             <Paragraph className="mt-2 text-gray-700">{item.description}</Paragraph>
//           </div>
//         </List.Item>
//       </div>
//     )}
//   />
// </Section>

//             <Section title="Publications" backgroundClass="bg8">
//   <div className="card-container ">
//     {user?.publications?.map((item, index) => (
//       <div className="card" key={index}>
//         <div className="card-content">
//           <Title level={5}>{item.title}</Title>
//           <Text>{item.journal}</Text><br />
//           <Text>{item.year}</Text>
//         </div>
//         <div className="card-hover-content">
//           <Title level={5}>{item.title}</Title>
//           <Text>{item.journal}</Text>
//           <Text>Vol:{item.volume}, Pages:{item.pages}</Text>
//           <Text>{item.year}</Text>
//           <Link to={item.doi}>
//             <Paragraph>{item.doi}</Paragraph>
//           </Link>
//         </div>
//       </div>
//     ))}
//   </div>
// </Section>
// <Modal
//   visible={loading}
//   className="flex justify-center items-center"
//   footer={null}
//   closable={false}
//   width={125}
//   centered
//   maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.6)"  }}
//   wrapClassName="bg-transparent"
// >
//   <div className="text-3xl bg-transparent">
//     <Mosaic color="#037bfc" size="medium" text="" textColor="" />
//   </div>
// </Modal>

//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default ProfessionalProfile;




import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  FaUserGraduate, 
  FaBriefcase, 
  FaAward, 
  FaLanguage,
  FaCertificate,
  FaEnvelope, 
  FaPhone, 
  FaGlobe,
  FaChevronDown,
  FaLinkedin,
  FaTwitter,
  FaExternalLinkAlt,
  FaMedal,
  FaBookOpen,
  FaGlobeAmericas,
  FaFacebook,
  FaRegEdit
} from 'react-icons/fa';
import { 
  SiJavascript, 
  SiPython, 
  SiReact, 
  SiNodedotjs,
  SiDocker
} from 'react-icons/si';
import { CiLogin } from "react-icons/ci";
import { Upload } from 'antd';

const ProfessionalProfile = () => {
  const [activeSection, setActiveSection] = useState('summary');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_URL}/get-all`);
        const data = await response.json();
        console.log(data.user)
        setUser(data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.4
      }
    }
  };

  const SkillIcon = ({ skill }) => {
    const iconMap = {
      'JavaScript': SiJavascript,
      'Python': SiPython,
      'React': SiReact,
      'Node.js': SiNodedotjs,
      'Docker': SiDocker
    };
    
    const Icon = iconMap[skill] || FaAward;
    return <Icon className="text-2xl" />;
  };

  const LoadingScreen = () => (
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
  );

  const Header = () => {
    const [isHovered, setIsHovered] = useState(false);
    
    if (!user) return null;

    return (
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      >
        
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900 to-black opacity-90" />
        <a href='/login'><div className='text-yellow-600  text-2xl absolute top-3 right-3'><CiLogin /></div></a>
        <motion.div
          className="relative z-10 text-white text-center space-y-6 max-w-4xl px-4"
          whileHover={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          <div className="relative w-48 h-48 mx-auto group">
  {/* Image with Hover Effect */}
  <motion.img
    src={user.profilePicture[user.profilePicture.length-1].imageUrl}
    alt={user.name}
    className="w-full h-full rounded-full shadow-xl border-4 border-white"
    whileHover={{ scale: 1.1 }}
    transition={{ duration: 0.3 }}
  />

  {/* Update Icon (Visible on Hover) */}
  <motion.div
    className="absolute bottom-3 left-24  transform -translate-x-1/2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100  text-white rounded-full p-2 shadow-md cursor-pointer transition-all duration-300"
    whileHover={{ scale: 1.2 }}
    onClick={() => console.log("Update clicked!")}
  >
    <Upload className='text-white'><FaRegEdit /></Upload>

  </motion.div>
</div>


          <motion.h1
            className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.3 }}
          >
            {user.name}
          </motion.h1>

          <motion.h2 className="text-2xl text-blue-200">
            {user.title}
          </motion.h2>

          <div className="flex space-x-6 justify-center text-blue-200">
            <ContactIcon Icon={FaEnvelope} text={user.contact?.email} />
            <ContactIcon Icon={FaPhone} text={user.contact?.phone} />
            <ContactIcon Icon={FaGlobe} text={`${user.contact?.city}, ${user.contact?.country}`} />
          </div>

          <div className="flex space-x-4 justify-center mt-6">
            <SocialButton Icon={FaFacebook} link="#" />
            <SocialButton Icon={FaLinkedin} link="https://www.linkedin.com/in/dr-melkamu-bezabih-yitbarek-15b1797a/" />
            <SocialButton Icon={FaTwitter} link="https://x.com/DrMelkamu" />
          </div>
        </motion.div>

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
  };

  const ContactIcon = ({ Icon, text }) => (
    <motion.div
      className="flex items-center space-x-2"
      whileHover={{ scale: 1.1 }}
      transition={{ duration: 0.2 }}
    >
      <Icon className="text-xl" />
      <span>{text}</span>
    </motion.div>
  );

  const SocialButton = ({ Icon, link }) => (
    <motion.a
      href={link}
      className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-blue-900 transition-colors duration-300"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon className="text-xl" />
    </motion.a>
  );

  const SkillCard = ({ skill }) => {
    const [ref, inView] = useInView({
      threshold: 0.1,
      triggerOnce: true
    });

    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={sectionVariants}
        className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <SkillIcon skill={skill.skill} />
        <h3 className="mt-4 text-lg font-semibold">{skill.skill}</h3>
      </motion.div>
    );
  };

  if (isLoading) return <LoadingScreen />;

  return (
    
    <div className="bg-gradient-to-b from-gray-900 to-black min-h-screen text-white">
    
      <Header />
      
      <main id="content" className="max-w-7xl mx-auto px-4 py-20 space-y-32">
        <AnimatePresence mode="wait">
        
          <Section title="Summary" Icon={FaUserGraduate}>
            <motion.p
              className="text-lg leading-relaxed text-gray-300"
              variants={sectionVariants}
            >
              {user?.summary}
            </motion.p>
          </Section>

          <Section title="Skills" Icon={FaAward}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {user?.skills?.map((skill, index) => (
                <SkillCard key={index} skill={skill} />
              ))}
            </div>
          </Section>

          <Section title="Experience" Icon={FaBriefcase}>
            <Timeline data={user?.experiences} />
          </Section>

          <Section title="Education" Icon={FaUserGraduate}>
            <Timeline data={user?.educations} />
          </Section>
           <Section title="Certificates" Icon={FaCertificate}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {user?.certificates?.map((cert, index) => (
            <CertificateCard key={index} certificate={cert} index={index} />
          ))}
        </div>
      </Section>

      <Section title="Awards" Icon={FaMedal}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {user?.awards?.map((award, index) => (
            <AwardCard key={index} award={award} index={index} />
          ))}
        </div>
      </Section>

      <Section title="Publications" Icon={FaBookOpen}>
        <div className="space-y-2 grid grid-cols-2 gap-2">
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
        </AnimatePresence>
        
      </main>
    </div>
  );
};

const Section = ({ title, Icon, children }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      // variants={sectionVariants}
      className="relative"
    >
      <div className="flex items-center space-x-4 mb-12">
        <Icon className="text-3xl text-blue-400" />
        <h2 className="text-3xl font-bold">{title}</h2>
      </div>
      {children}
    </motion.section>
  );
};

const Timeline = ({ data }) => {
  return (
    <div className="space-y-12">
      {data?.map((item, index) => (
        <TimelineItem key={index} item={item} index={index} />
      ))}
    </div>
  );
};
const CertificateCard = ({ certificate, index }) => {
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
        hidden: { opacity: 0, y: 50 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { 
            duration: 0.6,
            delay: index * 0.1
          }
        }
      }}
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
        {new Date(certificate.date).toLocaleDateString()}
      </p>
    </motion.div>
  );
};

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
  const [isExpanded, setIsExpanded] = useState(false);
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
      className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-colors duration-300"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-blue-400">{publication.title}</h3>
          <p className="mt-2 text-gray-400">{publication.journal}</p>
          <div className="flex items-center space-x-4 mt-2">
            <span className="text-sm text-gray-500">Volume: {publication.volume}</span>
            <span className="text-sm text-gray-500">Pages: {publication.pages}</span>
            <span className="text-sm text-gray-500">{publication.year}</span>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.open(publication.doi, '_blank')}
          className="flex items-center space-x-2 text-blue-400 hover:text-blue-300"
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

const TimelineItem = ({ item, index }) => {
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
      className="relative pl-8 border-l-2 border-blue-400"
    >
      <div className="absolute left-0 top-0 w-4 h-4 -translate-x-1/2 bg-blue-400 rounded-full" />
      <h3 className="text-xl font-semibold">{item.title || item.degree}</h3>
      <p className="text-gray-400">{item.institution}</p>
      <p className="text-gray-500">{item.startDate? (new Date(item.startDate).getFullYear() +"-" +
        (item.endDate !== "1800-07-16T00:00:00.000Z" 
          ? new Date(item.endDate).getFullYear()
          : "Present")):(new Date(item.graduationDate).toLocaleDateString())}</p>
      <p className="mt-2 text-gray-300">{item.description || item.thesis}</p>
    </motion.div>
  );
};

export default ProfessionalProfile;