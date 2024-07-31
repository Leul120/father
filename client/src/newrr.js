import React, { useEffect, useState } from "react";
import "tailwindcss/tailwind.css";
import { Card, List, Typography, Space, Progress, Divider, Avatar, Tag, Button } from "antd";
import { PhoneOutlined, MailOutlined, GlobalOutlined, UserOutlined } from "@ant-design/icons";
import { motion, useAnimation } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import { useInView } from "react-intersection-observer";
import gsap from "gsap";
import VerticalNavbar from "./Navigation";
import './App.css'
import { useNavigate } from "react-router-dom";
import pic from './Dr._Melkamus_Photo_.jpg'
const { Title, Text, Paragraph } = Typography;

const ProfessionalProfile = () => {
  const token = window.localStorage.getItem('token');
  const [user, setUser] = useState({});
  const [background, setBackground] = useState("bg1");

  useEffect(() => {
    fetchUser();
    animateListItems();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/get-user/66a888e5a36eb5f96844fb7e`);
      setUser(response.data.user);
    } catch (error) {
      console.log(error);
    }
  };
  const professional = {
    name: "John Doe",
    title: "Senior Researcher",
    contact: {
      phone: "123-456-7890",
      email: "johndoe@example.com",
      address: "123 Main St",
      institution: "Research Institute",
      city: "Anytown",
      country: "USA",
    },
    summary: "Experienced researcher with expertise in data science and machine learning.",
    experiences: [
      {
        position: "Data Scientist",
        institution: "Tech Corp",
        location: "New York, NY",
        startDate: "2019-01-01",
        endDate: "2023-06-30",
        description: "Worked on developing machine learning models.",
      },
      {
        position: "Research Assistant",
        institution: "University of Science",
        location: "Boston, MA",
        startDate: "2015-09-01",
        endDate: "2018-12-31",
        description: "Assisted in data analysis for various projects.",
      },
    ],
    skills: [
      { skill: "Python", level: 90 },
      { skill: "Machine Learning", level: 85 },
    ],
    education: [
      {
        degree: "Ph.D.",
        field: "Computer Science",
        institution: "University of Science",
        location: "Boston, MA",
        graduationDate: "2018-06-01",
        gpa: 3.9,
        thesis: "Thesis on Deep Learning Algorithms.",
      },
    ],
    languages: [
      { language: "English", proficiency: "Native" },
      { language: "Spanish", proficiency: "Fluent" },
    ],
    certificates: [
      {
        title: "Machine Learning Certification",
        institution: "Coursera",
        date: "2020-04-15",
        description: "Completed an online course on machine learning.",
      },
    ],
    awards: [
      {
        title: "Best Paper Award",
        institution: "AI Conference",
        year: 2021,
        description: "Received the best paper award at the AI conference.",
      },
    ],
    publications: [
      {
        title: "Deep Learning in AI",
        journal: "Journal of AI Research",
        volume: "45",
        pages: "123-145",
        year: 2021,
        url: "https://example.com/deep-learning-in-ai",
        doi: "10.1234/jair.2021.12345",
      },
    ],
  };

  const {
    name,
    title,
    contact,
    summary,
    experiences,
    skills,
    education,
    languages,
    certificates,
    awards,
    publications,
  } = professional;

  const animateListItems = () => {
    gsap.utils.toArray(".list-item").forEach(item => {
      gsap.fromTo(item, 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 0.6, scrollTrigger: { trigger: item, start: "top 80%" } }
      );
    });
  };
const navigate=useNavigate()
  const handleIntersection = (inView, entry, backgroundClass) => {
    if (inView) {
      setBackground(backgroundClass);
    }
  };

  const Section = ({ title, children, backgroundClass }) => {
    const { ref, inView } = useInView({
      threshold: 0.3, // Trigger when 30% of the section is in view
      triggerOnce: true,
    });

    useEffect(() => {
      handleIntersection(inView, ref, backgroundClass);
    }, [inView, ref, backgroundClass]);

    return (
      <div ref={ref} className=" p-8">
        <Divider>
          <Title level={3} className="text-indigo-600">
            {title}
          </Title>
        </Divider>
        {children}
      </div>
    );
  };

  const HeaderSection = ({ name, title, contact }) => (
    <div className="flex flex-col items-center justify-center text-center space-y-4">
      <Avatar size={150}  src={pic} />
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Title level={2} className="text-4xl text-white mt-4 mb-2">
          {name}
        </Title>
      </motion.div>
      <Text className="text-xl ">({title})</Text>
      <div className="flex space-x-4 mt-2 text-white">
        <Text>
          <PhoneOutlined className="mr-2" />
          {contact?.phone}
        </Text>
        <Text>
          <MailOutlined className="mr-2" />
          {contact?.email}
        </Text>
        <Text>
          <GlobalOutlined className="mr-2" />
          {contact?.institution}, {contact?.city}, {contact?.country}
        </Text>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen pt-4 relative nineth p-2 overflow-hidden ${background} transition-all duration-500`}>
    
      {token && <VerticalNavbar />}
      <div className="absolute inset-0 -z-10 transition-transform duration-500">
        <div className="w-full  h-full opacity-40"></div>
      </div>
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="shadow-lg rounded-lg overflow-hidden">
          <div>
          <Button onClick={()=>navigate('/contact-us')} className="   float-start  rounded-lg fixed cursor-pointer">Contact Me</Button>
            <HeaderSection name={user?.name} title={user?.title} contact={user?.contact} />

            <Section title="Summary" backgroundClass="bg1">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="hover:scale-105 transition-transform duration-300"
              >
                <Paragraph className="text-center">{user?.summary}</Paragraph>
              </motion.div>
            </Section>
    <Section title="Education" backgroundClass="bg4">
              <List
                itemLayout="vertical"
                dataSource={user?.education}
                renderItem={(item) => (
                  <div className="list-item">
                    <List.Item>
                      <Title level={4}>{item.degree}</Title>
                      <Text>{item.field}</Text>
                      <Text>{item.institution}, {item.location}</Text>
                      <Text>{new Date(item.graduationDate).toLocaleDateString()}</Text>
                      <Paragraph>GPA: {item.gpa}</Paragraph>
                      <Paragraph>Thesis: {item.thesis}</Paragraph>
                    </List.Item>
                  </div>
                )}
              />
            </Section>
            <Section title="Experiences" backgroundClass="bg2">
              <List
                itemLayout="vertical"
                dataSource={user?.experiences}
                renderItem={(item) => (
                  <div className="list-item">
                    <List.Item>
                      <Title level={4}>{item.position}</Title>
                      <Text>{item.institution}, {item.location}</Text>
                      <Paragraph>{item.description}</Paragraph>
                      <Text type="secondary">
                        {new Date(item.startDate).toLocaleDateString()} - {item.endDate? new Date(item.endDate).toLocaleDateString() : "present"}
                      </Text>
                    </List.Item>
                  </div>
                )}
              />
            </Section>

            <Section title="Skills" backgroundClass="bg3">
              <Space wrap>
                {user?.skills?.map((skill, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    className="cursor-pointer"
                  >
                    <Tag color="" className="p-3 text-lg">{skill.skill}</Tag>
                  </motion.div>
                ))}
              </Space>
            </Section>

            

            <Section title="Languages" backgroundClass="bg5">
              <List
                itemLayout="horizontal"
                dataSource={user?.languages}
                renderItem={(item) => (
                  <div className="list-item">
                    <List.Item>
                      <Tag color="blue" className="p-3 text-lg">{item.language}</Tag>
                    </List.Item>
                  </div>
                )}
              />
            </Section>

         <Section title="Certificates" backgroundClass="bg6">
  <div
    
    className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2  ">
    {user?.certificates?.map((item) => (
      <div className="list-item mb-6 m-2 ">
        <List.Item>
          <div className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
            <Title level={4} className="text-xl font-semibold text-gray-800 hover:text-blue-600">{item.title}</Title>
            <Text className="text-gray-600">{item.institution}</Text>
            <Text className="text-gray-500 text-sm block">{new Date(item.date).toLocaleDateString()}</Text>
            <Paragraph className="mt-2 text-gray-700">{item.description}</Paragraph>
          </div>
        </List.Item>
      </div>
    ))}
  </div>
</Section>

            <Section title="Awards" backgroundClass="bg7">
  <List
    itemLayout="vertical"
    dataSource={user?.awards}
    renderItem={(item) => (
      <div className="list-item mb-6">
        <List.Item>
          <div className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
            <Title level={4} className="text-xl font-semibold text-gray-800 hover:text-blue-600">{item.title}</Title>
            <Text className="text-gray-600">{item.institution}</Text>
            <Text className="text-gray-500 text-sm block">{item.year}</Text>
            <Paragraph className="mt-2 text-gray-700">{item.description}</Paragraph>
          </div>
        </List.Item>
      </div>
    )}
  />
</Section>

            <Section title="Publications" backgroundClass="bg8">
  <div className="card-container ">
    {user?.publications?.map((item, index) => (
      <div className="card" key={index}>
        <div className="card-content">
          <Title level={5}>{item.title}</Title>
          <Text>{item.journal}</Text><br />
          <Text>{item.year}</Text>
        </div>
        <div className="card-hover-content">
          <Title level={5}>{item.title}</Title>
          <Text>{item.journal}</Text>
          <Text>Vol:{item.volume}, Pages:{item.pages}</Text>
          <Text>{item.year}</Text>
          <Link to={item.doi}>
            <Paragraph>{item.doi}</Paragraph>
          </Link>
        </div>
      </div>
    ))}
  </div>
</Section>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfessionalProfile;




