import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";

const useUserInfo = () => {
    const axiosSecure = useAxiosSecure(); // Custom hook for making authenticated API requests.
    const { user } = useAuth(); // Custom hook to get authentication information, including the user object.

    const { data: userInfo, isLoading, refetch } = useQuery({
        queryKey: ["user", user?.email], // Unique key for the query; changes to user?.email will trigger a refetch.
        queryFn: async () => {
            // Simulate an API delay for demonstration purposes. In a real application, this wouldn't be needed.
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const res = await axiosSecure.get(`/user/${user?.email}`); // Fetch user data based on the logged-in user's email.
            return res.data;
        },
        enabled: !!user?.email, // Only enable the query if the user's email is available (user is logged in).
    });

    return { userInfo, isLoading, refetch }; // Return the fetched user data, loading state, and the function to manually refetch the data.
};

export default useUserInfo;