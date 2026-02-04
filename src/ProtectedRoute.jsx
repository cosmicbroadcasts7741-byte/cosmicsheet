import { useAuth } from "./AuthProvider";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { email } = useAuth();
  console.log("ProtectedRoute", email);
  if (!email) {
    return <Navigate to="/" />;
  }
  return <>{children}</>;
}
