import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";
// import useAxiosCommon from "./useAxiosCommon";

const useUserInfo = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

    const { data: userInfo, isLoading, refetch } = useQuery({
        queryKey: ["user", user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/user/${user.email}`);
            return res.data;
        },
        enabled: !!user?.email,
    })
    return { userInfo, isLoading, refetch }
};

export default useUserInfo;

