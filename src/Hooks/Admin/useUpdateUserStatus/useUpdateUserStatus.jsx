import useAxiosSecure from "../../useAxiosSecure";
import { useQueryClient } from "@tanstack/react-query";

const useUpdateUserStatus = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const updateUserStatus = async ({ id, verify }) => {
        try {
            const res = await axiosSecure.patch(`/admin/users/${id}`, { verify });
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