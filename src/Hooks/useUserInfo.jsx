import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";

const useUserInfo = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

    const { data: userInfo, isLoading, refetch } = useQuery({
        queryKey: ["user", user?.email],
        queryFn: async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const res = await axiosSecure.get(`/user/${user.email}`);
            return res.data;
        },
        enabled: !!user?.email,
    });

    return { userInfo, isLoading, refetch };
};

export default useUserInfo;