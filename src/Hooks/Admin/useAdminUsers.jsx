import React from "react";
import useAxiosSecure from "../useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const useAdminUsers = () => {
    const axiosSecure = useAxiosSecure();

    const { data: users = [], isLoading, isError } = useQuery({
        queryKey: ["adminUsers"],
        queryFn: async () => {
            const res = await axiosSecure.get("/admin/users");
            return res.data;
        },
    });

    return { users, isLoading, isError };
};

export default useAdminUsers;