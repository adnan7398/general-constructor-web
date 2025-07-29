import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppearanceProvider } from './contexts/AppearanceContext';
import Navbar from './pages/components/Navbar';
import HeroSection from './pages/components/HeroSection';
import AboutSection from './pages/components/AboutSection';
import ServicesSection from './pages/components/ServicesSection';
import WhyChooseUsSection from './pages/components/WhyChooseUsSection';
import ProjectsSection from './pages/components/ProjectsSection';
import ContactSection from './pages/components/ContactSection';
import Footer from './pages/components/Footer';
import SignIn from './auth/Signin';
import Dashboard from './adminpages/pages/Dashboard';
import Projects from '../src/adminpages/pages/projects';
import TeamMembers from './adminpages/pages/teammember';
import SiteAccountPage from './adminpages/pages/account'
import Resources from './adminpages/pages/resources';
import Account from './adminpages/pages/totalacount';
import ProfilePage from './adminpages/pages/profile';
import SettingsPage from './adminpages/pages/settings';
import Layout from './adminpages/layout';

function App() {
  return (
    <AppearanceProvider>
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
          
          {/* Admin Routes with Layout */}
          <Route path="/dashboard" element={
            <Layout>
              <Dashboard />
            </Layout>
          } />
          <Route path="/project" element={
            <Layout>
              <Projects />
            </Layout>
          } />
          <Route path="/resources" element={
            <Layout>
              <Resources />
            </Layout>
          } />
          <Route path="/team" element={
            <Layout>
              <TeamMembers />
            </Layout>
          } />
          <Route path="/budgets" element={
            <Layout>
              <SiteAccountPage />
            </Layout>
          } />
          <Route path="/totalaccount" element={
            <Layout>
              <Account />
            </Layout>
          } />
                  <Route path="/profile" element={
          <Layout>
            <ProfilePage />
          </Layout>
        } />
        <Route path="/settings" element={
          <Layout>
            <SettingsPage />
          </Layout>
        } />
        </Routes>
      </div>
      </Router>
    </AppearanceProvider>
  );
}

export default App;
