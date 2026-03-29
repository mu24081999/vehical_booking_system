import { Navigate, Outlet } from "react-router-dom";

type ProtectedRouteProps = {
  token: string;
};

export function ProtectedRoute({ token }: ProtectedRouteProps) {
  if (!token) return <Navigate to="/login" replace />;
  return <Outlet />;
}
