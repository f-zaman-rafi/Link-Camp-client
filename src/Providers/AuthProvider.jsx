import React, { useEffect, useState } from "react";
import app from "../Firebase/Firebase.config";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { AuthContext } from "./AuthContext";

const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null);
  const [id, setId] = useState(null);
  const [department, setDepartment] = useState(null);
  const [session, setSession] = useState(null);
  const [verify, setVerify] = useState(null);
  //
  //
  // create user
  //
  //
  const signUp = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };
  //
  //
  // sign-in
  //
  //
  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };
  //
  //
  // log-out
  //
  //
  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };
  //
  //
  // Monitor authentication state changes and update the user state
  //
  //
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log("current user", currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    signUp,
    signIn,
    logOut,
    setUserType,
    setDepartment,
    setSession,
    userType,
    department,
    session,
    id,
    setId,
    verify,
    setVerify,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
