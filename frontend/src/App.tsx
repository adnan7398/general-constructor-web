import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppearanceProvider } from './contexts/AppearanceContext';
import { AuthProvider } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import SignIn from './auth/Signin';
import Dashboard from './adminpages/pages/Dashboard';
import Projects from '../src/adminpages/pages/projects';
import TeamMembers from './adminpages/pages/teammember';
import SiteAccountPage from './adminpages/pages/account'
import Resources from './adminpages/pages/resources';
import Account from './adminpages/pages/totalaccount';
import ProfilePage from './adminpages/pages/profile';
import SettingsPage from './adminpages/pages/settings';
import QuotesPage from './adminpages/pages/quotes';
import ReportsPage from './adminpages/pages/reports';
import ProjectDocuments from './pages/ProjectDocuments';
import Layout from './adminpages/layout';
import ProtectedRoute from './components/layout/ProtectedRoute';


function App() {
  return (
    <AppearanceProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/signin" element={<SignIn />} />

              {/* Protected Admin Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/project" element={
                <ProtectedRoute>
                  <Layout>
                    <Projects />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/resources" element={
                <ProtectedRoute>
                  <Layout>
                    <Resources />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/quotes" element={
                <ProtectedRoute>
                  <Layout>
                    <QuotesPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/team" element={
                <ProtectedRoute>
                  <Layout>
                    <TeamMembers />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/budgets" element={
                <ProtectedRoute>
                  <Layout>
                    <SiteAccountPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/totalaccount" element={
                <ProtectedRoute>
                  <Layout>
                    <Account />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Layout>
                    <ProfilePage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Layout>
                    <SettingsPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/reports" element={
                <ProtectedRoute>
                  <Layout>
                    <ReportsPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/project/:id/documents" element={
                <ProtectedRoute>
                  <Layout>
                    <ProjectDocuments />
                  </Layout>
                </ProtectedRoute>
              } />


            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </AppearanceProvider>
  );
}

export default App;
