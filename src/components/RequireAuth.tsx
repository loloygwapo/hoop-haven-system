
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { PageTransition } from "./PageTransition";

interface RequireAuthProps {
  children: JSX.Element;
  adminOnly?: boolean;
}

export function RequireAuth({ children, adminOnly = false }: RequireAuthProps) {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  // Still loading user data
  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="animate-pulse space-y-4 text-center">
            <div className="h-8 w-8 mx-auto bg-primary/20 rounded-full"></div>
            <div className="text-sm text-muted-foreground">Loading...</div>
          </div>
        </div>
      </PageTransition>
    );
  }

  // No user is signed in
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is not an admin but trying to access admin page
  if (adminOnly && !isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Render the protected component
  return children;
}
