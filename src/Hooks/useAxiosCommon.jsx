import axios from "axios";

// Create an Axios instance with common configuration
export const axiosCommon = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});
const useAxiosCommon = () => {
  // Return the Axios instance
  return axiosCommon;
};

export default useAxiosCommon;
