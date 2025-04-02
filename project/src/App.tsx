import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import DownloadPage from './pages/Download';
import Feedback from './pages/Feedback';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <>
                  <Navbar />
                  <div className="pt-16">
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/upload" element={<Upload />} />
                      <Route path="/download" element={<DownloadPage />} />
                      <Route path="/feedback" element={<Feedback />} />
                    </Routes>
                  </div>
                </>
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