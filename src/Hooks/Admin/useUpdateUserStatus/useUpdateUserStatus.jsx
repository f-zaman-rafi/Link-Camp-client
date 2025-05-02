import useAxiosSecure from "../../useAxiosSecure";
import { useQueryClient } from "@tanstack/react-query";

const useUpdateUserStatus = () => {
    // Secure Axios instance
    const axiosSecure = useAxiosSecure();
    // Query client instance
    const queryClient = useQueryClient();

    const updateUserStatus = async ({ id, verify }) => {
        try {
            // API call to update user status
            const res = await axiosSecure.patch(`/admin/users/${id}`, { verify });
            // Invalidate and refresh data for the query
            queryClient.invalidateQueries(["adminUsers"]);
            return res.data;
        } catch (error) {
            console.error("Error updating user status:", error);
            throw error;
        }
    };

    return { updateUserStatus };
};

export default useUpdateUserStatus;