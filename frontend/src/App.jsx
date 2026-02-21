import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuthContext } from "./context/AuthContext.jsx";
import Navbar from "./components/Navbar.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import PostDetailPage from "./pages/PostDetailPage.jsx";
import CreatePostPage from "./pages/CreatePostPage.jsx";
import EditPostPage from "./pages/EditPostPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuthContext();
  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  return user ? children : <Navigate to="/login" replace />;
};

const GuestRoute = ({ children }) => {
  const { user, loading } = useAuthContext();
  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  return !user ? children : <Navigate to="/" replace />;
};

const AppRoutes = () => (
  <>
    <Navbar />
    <Routes>
      <Route path="/"          element={<DashboardPage />} />
      <Route path="/posts/:id" element={<PostDetailPage />} />
      <Route path="/login"     element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register"  element={<GuestRoute><RegisterPage /></GuestRoute>} />
      <Route path="/create"    element={<PrivateRoute><CreatePostPage /></PrivateRoute>} />
      <Route path="/edit/:id"  element={<PrivateRoute><EditPostPage /></PrivateRoute>} />
      <Route path="*"          element={<Navigate to="/" replace />} />
    </Routes>
  </>
);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
