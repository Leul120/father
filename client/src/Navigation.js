import React from 'react';
import { Menu } from 'antd';
import {
  UserOutlined,
  FileTextOutlined,
  BookOutlined,
  ToolOutlined,
  GlobalOutlined,
  TrophyOutlined,
  StarOutlined,
  ReadOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const VerticalNavbar = () => {
  return (
    <div className=" rounded-xl bg-gray-100 text-white p-4">
      <Menu
        mode="inline"
        
        style={{ height: '100%', borderRight: 0 }}
        theme="light"
      >
        <Menu.Item key="profile" icon={<UserOutlined />}>
          <Link to="/user-profile">Your Profile</Link>
        </Menu.Item>
        <Menu.Item key="experiences" icon={<FileTextOutlined />}>
          <Link to="/experiences">Experiences</Link>
        </Menu.Item>
        <Menu.Item key="skills" icon={<ToolOutlined />}>
          <Link to="/skills">Skills</Link>
        </Menu.Item>
        <Menu.Item key="education" icon={<BookOutlined />}>
          <Link to="/educations">Education</Link>
        </Menu.Item>
        <Menu.Item key="languages" icon={<GlobalOutlined />}>
          <Link to="/languages">Languages</Link>
        </Menu.Item>
        <Menu.Item key="certificates" icon={<TrophyOutlined />}>
          <Link to="/certificates">Certificates</Link>
        </Menu.Item>
        <Menu.Item key="awards" icon={<StarOutlined />}>
          <Link to="/awards">Awards</Link>
        </Menu.Item>
        <Menu.Item key="publications" icon={<ReadOutlined />}>
          <Link to="/publications">Publications</Link>
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default VerticalNavbar;
