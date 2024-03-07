import React from "react";
import { AuthContext } from "./AuthProvider";
import { Navigate, useLocation } from "react-router";

export function RequireAuth({ children }: { children: JSX.Element }) {
  let auth = React.useContext(AuthContext);
  let location = useLocation();

  if (!auth.currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}