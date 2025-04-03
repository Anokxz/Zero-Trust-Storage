import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import DownloadPage from './pages/Download';
import Feedback from './pages/Feedback';


// Fake authentication check (Replace this with actual authentication logic)
const isAuthenticated = () => !!localStorage.getItem('authToken');

const ProtectedRoute = ({ element }: { element: React.ReactElement }) => {
  return isAuthenticated() ? element : <Navigate to="/login" replace />;
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Protected Routes */}
            <Route
              path="/*"
              element={
                isAuthenticated() ? (
                  <>
                    <Navbar />
                    <div className="pt-16">
                      <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
                        <Route path="/upload" element={<ProtectedRoute element={<Upload />} />} />
                        <Route path="/download" element={<ProtectedRoute element={<DownloadPage />} />} />
                        <Route path="/feedback" element={<ProtectedRoute element={<Feedback />} />} />
                      </Routes>
                    </div>
                  </>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
