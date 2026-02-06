import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  // Not logged in → redirect
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Logged in → allow page
  return children;
}
