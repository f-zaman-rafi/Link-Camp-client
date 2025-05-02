import React from "react";
import useAxiosSecure from "../../useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const useAdminUsers = () => {

    // secure Axios instance
    const axiosSecure = useAxiosSecure();

    const { data: users = [], isLoading, isError } = useQuery({
        queryKey: ["adminUsers"],
        queryFn: async () => {
            // API call
            const res = await axiosSecure.get("/admin/users");
            return res.data;
        },
    });
    // return fetched data and status
    return { users, isLoading, isError };
};

export default useAdminUsers;