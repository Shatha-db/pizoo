import { useState, useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { useTranslation } from "react-i18next";
import "./i18n/config";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Discover from "./pages/Discover";
import Encounters from "./pages/Encounters";
import Matches from "./pages/Matches";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import LikesMe from "./pages/LikesMe";
import Notifications from "./pages/Notifications";
import UserProfile from "./pages/UserProfile";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("pizoo_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { i18n } = useTranslation();

  useEffect(() => {
    // Set RTL for Arabic
    document.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  useEffect(() => {
    const token = localStorage.getItem("pizoo_token");
    if (token) {
      api.get("/auth/me")
        .then((res) => {
          setUser(res.data);
        })
        .catch(() => {
          localStorage.removeItem("pizoo_token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const ProtectedRoute = ({ children }) => {
    if (loading) return <div className="loading-screen">جاري التحميل...</div>;
    if (!user) return <Navigate to="/auth" />;
    return children;
  };

  if (loading) {
    return <div className="loading-screen">جاري التحميل...</div>;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/encounters" /> : <Landing />} />
          <Route path="/auth" element={user ? <Navigate to="/encounters" /> : <Auth setUser={setUser} />} />
          <Route path="/encounters" element={<ProtectedRoute><Encounters user={user} /></ProtectedRoute>} />
          <Route path="/discover" element={<ProtectedRoute><Discover user={user} /></ProtectedRoute>} />
          <Route path="/matches" element={<ProtectedRoute><Matches user={user} /></ProtectedRoute>} />
          <Route path="/likes-me" element={<ProtectedRoute><LikesMe user={user} /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications user={user} /></ProtectedRoute>} />
          <Route path="/chat/:matchId" element={<ProtectedRoute><Chat user={user} /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile user={user} setUser={setUser} /></ProtectedRoute>} />
          <Route path="/user/:userId" element={<ProtectedRoute><UserProfile user={user} /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;
