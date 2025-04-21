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
import useAxiosCommon from "../Hooks/useAxiosCommon";

const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  const axiosCommon = useAxiosCommon();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
  const logOut = async () => {
    try {
      const res = await axiosCommon.post("/logout");
      console.log(res.data);
      await signOut(auth);
    } catch (err) {
      console.error("Logout failed", err);
    }
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

  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
