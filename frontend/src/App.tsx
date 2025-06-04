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
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
