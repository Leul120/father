import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createContext } from 'react';

// Import Components
import ProfessionalProfile from './newrr';
import AwardsForm from './Awards';
import CertificatesForm from './Certificates';
import EducationForm from './Educations';
import ExperienceForm from './Experiences';
import PublicationForm from './publications';
import SkillForm from './SKills';
import Login from './Login';
import UserProfileForm from './UserProfile';
import ContactUs from './ContactUs';
import LanguageForm from './Languages';
import HorizontalNavbar from './Navigation';

// App Context
export const AppContext = createContext();

function App() {
  const token = window.localStorage.getItem('token');
  const [user, setUser] = useState(null);
  const [loading,setLoading]=useState(false)

  return (
    <AppContext.Provider value={{ user, setUser, token,loading,setLoading }}>
      <Router>
        {token && (
          <div className="navbar-container">
            <HorizontalNavbar />
          </div>
        )}
        <Routes>
          <Route path="/" element={<ProfessionalProfile />} />
          <Route path="/awards" element={<AwardsForm />} />
          <Route path="/certificates" element={<CertificatesForm />} />
          <Route path="/educations" element={<EducationForm />} />
          <Route path="/experiences" element={<ExperienceForm />} />
          <Route path="/languages" element={<LanguageForm />} />
          <Route path="/skills" element={<SkillForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/publications" element={<PublicationForm />} />
          <Route path="/user-profile" element={<UserProfileForm />} />
          <Route path="/contact" element={<ContactUs />} />
        </Routes>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
