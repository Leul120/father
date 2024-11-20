import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
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
import { createContext } from 'react';

import HorizontalNavbar from './Navigation';
export const  AppContext=createContext()

function App() {
   const token=window.localStorage.getItem("token")
  console.log(token)
  const [user, setUser] = useState(null);
  return (
    <>
      <div>
       <AppContext.Provider value={{user,setUser,token}}>
        <Router>
      {token &&<div className="navbar-container">
          <HorizontalNavbar />
        </div>}
        <Routes>
          <Route path='/' element={<ProfessionalProfile/>}/>
          <Route path='/awards' element={<AwardsForm/>}/>
          <Route path='/certificates' element={<CertificatesForm/>}/>
          <Route path='/educations' element={<EducationForm/>}/>
          <Route path='/experiences' element={<ExperienceForm/>}/>
          <Route path='/languages' element={<LanguageForm/>}/>
          <Route path='/skills' element={<SkillForm/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/publications' element={<PublicationForm/>}/>
          <Route path='/user-profile' element={<UserProfileForm/>}/>
          <Route path="/contact-us" element={<ContactUs/>}/>
          
        </Routes>
        
      </Router>
      </AppContext.Provider>
      </div>
      
    </>
  )
}

export default App
