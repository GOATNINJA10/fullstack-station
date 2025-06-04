import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StationListPage from './pages/StationListPage';
import StationMapPage from './pages/StationMapPage';
import StationFormPage from './pages/StationFormPage';
import Header from './components/Header';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/" element={<ProtectedRoute><StationListPage /></ProtectedRoute>} />
              <Route path="/map" element={<ProtectedRoute><StationMapPage /></ProtectedRoute>} />
              <Route path="/stations/new" element={<ProtectedRoute><StationFormPage /></ProtectedRoute>} />
              <Route path="/stations/:id/edit" element={<ProtectedRoute><StationFormPage /></ProtectedRoute>} />
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </main>
          <footer className="bg-blue-800 text-white py-4">
            <div className="container mx-auto px-4 text-center">
              <p>© {new Date().getFullYear()} EV Charging Station Management System</p>
            </div>
          </footer>
        </div>
        <Toaster position="top-right" />
      </Router>
    </AuthProvider>
  );
}

export default App;