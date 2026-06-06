import type { ReactElement } from "react";
import { useAuth } from "../context/useAuth";
import { Navigate } from "react-router-dom";

type ProtectedRoute = {
  children: ReactElement;
  allowedRole?: string;
};

function ProtectedRoute({
  children,
  allowedRole,
}: ProtectedRoute): ReactElement {
  const { user, role, loading } = useAuth();
  if (loading)
    return (
      <div className="flex justify-center items-center h-40">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!user) return <Navigate to="/login" />;

  if (allowedRole && role !== allowedRole)
    return (
      <Navigate
        to={role === "owner" ? "/my-restaurants" : "/restaurants"}
        replace
      />
    );

  return children;
}

export default ProtectedRoute;
