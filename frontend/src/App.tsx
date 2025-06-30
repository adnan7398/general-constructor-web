import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './pages/components/Navbar';
import HeroSection from './pages/components/HeroSection';
import AboutSection from './pages/components/AboutSection';
import ServicesSection from './pages/components/ServicesSection';
import WhyChooseUsSection from './pages/components/WhyChooseUsSection';
import ProjectsSection from './pages/components/ProjectsSection';
import ContactSection from './pages/components/ContactSection';
import Footer from './pages/components/Footer';
import SignIn from './auth/Signin';
import Dashboard from './adminpages/pages/Dashboard'; // Adjust the import path as necessary
import Projects from '../src/adminpages/pages/projects'; // Adjust the import path as necessary 
import TeamMembers from './adminpages/pages/teammember';
import SiteAccountPage from './adminpages/pages/account'
import Resources from './adminpages/pages/resources';
import Account from './adminpages/pages/totalacount';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route
            path="/"
            element={
              <>              
                <Navbar />
                <HeroSection />
                <AboutSection />
                <ServicesSection />
                <WhyChooseUsSection />
                <ProjectsSection />
                <ContactSection />
                <Footer />  
              </>
            }
          />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/project" element={<Projects />} />
          <Route path="/resources" element={<Resources/>} />
         < Route path="/team" element={<TeamMembers/>}/>
         <Route path='/budgets' element={<SiteAccountPage/>} />
         <Route path="/totalaccount" element={<Account />} />
          {/* i can Add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
