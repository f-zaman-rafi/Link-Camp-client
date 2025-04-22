import useAxiosSecure from "../../useAxiosSecure";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useUpdateUserStatus = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    return useMutation(
        async ({ id, verify }) => {
            const res = await axiosSecure.patch(`/admin/users/${id}`, { verify });
            return res.data;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["adminUsers"]);
            },
            onError: (error) => {
                console.error("Error updating user status:", error);
            },
        }
    );
};

export default useUpdateUserStatus;
