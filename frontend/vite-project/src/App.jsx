import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChatPage from './pages/ChatPage';
import JournalPage from './pages/JournalPage';
import CaregiverPage from './pages/CaregiverPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
          <Route path="/journal" element={<ProtectedRoute><JournalPage /></ProtectedRoute>} />
          <Route path="/caregiver" element={<ProtectedRoute><CaregiverPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/chat" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
