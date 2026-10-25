import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/useAuth";

/**
 * ProtectedRoute Component
 * Enforces strict role-based access control (RBAC).
 * 
 * Rules:
 * 1. Only 3 roles exist: "client", "freelancer", "admin".
 * 2. Each user belongs to exactly one role.
 * 3. Users cannot access each other's dashboards.
 *    - Client can only access Client Dashboard (/client-dashboard)
 *    - Freelancer can only access Freelancer Dashboard (/freelancer-dashboard)
 *    - Admin can only access Admin Dashboard (/admin-dashboard)
 * 4. Unauthorized dashboard visits are redirected immediately to the user's own dashboard.
 */
export default function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ padding: "80px 20px", textAlign: "center", color: "var(--slate-500)" }}>
        Loading session...
      </div>
    );
  }

  // Not logged in -> Redirect to Login
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
          targetRole: requiredRole || null,
          message: requiredRole
            ? `Please log in as a ${requiredRole} to access this section.`
            : "Please log in to continue.",
        }}
      />
    );
  }

  // Determine the user's authorized home dashboard
  const userHomeDashboard =
    user.role === "admin"
      ? "/admin-dashboard"
      : user.role === "freelancer"
      ? "/freelancer-dashboard"
      : "/client-dashboard";

  // Strict role check: If route requires a specific role and current user does not match
  if (requiredRole && user.role !== requiredRole) {
    // Redirect user to their own authorized dashboard with a clear, helpful notice
    return (
      <Navigate
        to={userHomeDashboard}
        replace
        state={{
          accessDenied: true,
          attemptedPath: location.pathname,
          message: `Notice: "${location.pathname}" is reserved for ${requiredRole} accounts. Redirected to your ${user.role} dashboard.`,
        }}
      />
    );
  }

  return children;
}
