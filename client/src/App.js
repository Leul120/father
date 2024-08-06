
import './App.css';
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import ProfessionalProfile from './newrr';
import AwardsForm from './Awards';
import CertificatesForm from './Certificates';
import EducationForm from './Educations';
import ExperienceForm from './Experiences';
import PublicationForm from './publications';
import SkillForm from './SKills';
import Signup from './Signup';
import Login from './Login';
import UserProfileForm from './UserProfile';
import ContactUs from './ContactUs';
import LanguageForm from './Languages';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<ProfessionalProfile/>}/>
          <Route path='/awards' element={<AwardsForm/>}/>
          <Route path='/certificates' element={<CertificatesForm/>}/>
          <Route path='/educations' element={<EducationForm/>}/>
          <Route path='/experiences' element={<ExperienceForm/>}/>
          <Route path='/languages' element={<LanguageForm/>}/>
          <Route path='/skills' element={<SkillForm/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='login' element={<Login/>}/>
          <Route path='/publications' element={<PublicationForm/>}/>
          <Route path='/user-profile' element={<UserProfileForm/>}/>
          <Route path="/contact-us" element={<ContactUs/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
