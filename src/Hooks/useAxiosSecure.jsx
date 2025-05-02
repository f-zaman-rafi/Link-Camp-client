import axios from "axios";
import useAuth from "./useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

// Create an Axios instance with secure configuration
const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const useAxiosSecure = () => {
  const { logOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Add interceptor to handle unauthorized or forbidden responses
    const interceptor = axiosSecure.interceptors.response.use(
      (res) => res,
      async (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.warn("Unauthorized or Forbidden — logging out.");
          await logOut();
          navigate("/sign-in");
        }
        return Promise.reject(error);
      }
    );
    // Clean up interceptor on component unmount
    return () => {
      axiosSecure.interceptors.response.eject(interceptor);
    };
  }, [logOut, navigate]);
  return axiosSecure;
};

export default useAxiosSecure;
