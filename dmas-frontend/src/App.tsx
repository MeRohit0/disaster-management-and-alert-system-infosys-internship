import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";
import type { JSX } from "react/jsx-runtime";
import AuthPage from "./pages/AuthPage";
import AdminDashboard from "./pages/AdminDashboard";
import ResponderDashboard from "./pages/ResponderDashboard";
import CitizenDashboard from "./pages/CitizenDashboard";
import Navbar from "./components/Navbar";

const ProtectedRoute = ({
  children,
  role,
}: {
  children: JSX.Element;
  role: string;
}) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role !== role)
    return <div className="p-10 text-red-600 font-bold">Access Denied</div>;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="ROLE_ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/auth" />} />
          <Route
            path="/responder"
            element={
              <ProtectedRoute role="ROLE_RESPONDER">
                <ResponderDashboard />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/citizen" 
            element={
              <ProtectedRoute role="ROLE_CITIZEN">
                <CitizenDashboard />
              </ProtectedRoute>
            } 
          />
          {/* Default Redirection */}
          <Route path="/" element={<Navigate to="/auth" />} />
          <Route path="*" element={<Navigate to="/auth" />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
