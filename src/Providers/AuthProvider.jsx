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

/**
 * Provides authentication context to the application using Firebase.
 */
const AuthProvider = ({ children }) => {
  const axiosCommon = useAxiosCommon();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Creates a new user with the given email and password.
   * @param {string} email The user's email address.
   * @param {string} password The user's password.
   * @returns {Promise<import("firebase/auth").UserCredential>} A Promise that resolves with the user credential upon successful creation.
   */
  const signUp = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  /**
   * Signs in an existing user with the given email and password.
   * @param {string} email The user's email address.
   * @param {string} password The user's password.
   * @returns {Promise<import("firebase/auth").UserCredential>} A Promise that resolves with the user credential upon successful sign-in.
   */
  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  /**
   * Logs out the current user.
   * It first attempts to invalidate the session on the server and then signs out from Firebase.
   * @returns {Promise<void>} A Promise that resolves when the user is successfully logged out.
   */
  const logOut = async () => {
    try {
      await axiosCommon.post("/logout"); // Invalidate session on the server.
      await signOut(auth); // Sign out from Firebase.
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  /**
   * useEffect hook to monitor authentication state changes.
   * It updates the 'user' state whenever the authentication state in Firebase changes.
   * This ensures that the application is aware of the current authentication status.
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Set loading to false after the initial auth state is determined.
    });

    // Cleanup function to unsubscribe from the listener when the component unmounts.
    return () => unsubscribe();
  }, []);

  /**
   * The value object that will be provided to the AuthContext.
   * It contains the user object, loading state, and authentication functions.
   */
  const authInfo = {
    user,
    loading,
    signUp,
    signIn,
    logOut,
  };

  /**
   * Provides the authentication context to its children.
   */
  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;