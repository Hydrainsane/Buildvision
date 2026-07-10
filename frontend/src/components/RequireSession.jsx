import { Navigate } from "react-router-dom";

/**
 * The backend requires no authentication, so this only prevents
 * someone from deep-linking straight into the dashboard shell without
 * passing through the login screen first. Swap for real auth checks
 * if/when the backend adds an auth endpoint.
 */
export default function RequireSession({ children }) {
  const hasSession = sessionStorage.getItem("buildvision_session") === "active";
  if (!hasSession) {
    return <Navigate to="/" replace />;
  }
  return children;
}
