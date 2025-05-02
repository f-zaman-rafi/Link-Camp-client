import React, { useContext } from "react";
import { AuthContext } from "../Providers/AuthContext";

// Use context to access authentication state
const useAuth = () => {
  const auth = useContext(AuthContext);
  return auth;
};

export default useAuth;
