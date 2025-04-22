import useAxiosSecure from "../../useAxiosSecure";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useUpdateUserStatus = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    return useMutation(
        ({ _id, verify }) => axiosSecure.patch(`/admin/users/${_id}`, { verify }),
        {
            onSuccess: () => queryClient.invalidateQueries(["adminUsers"]),
        }
    );
};

export default useUpdateUserStatus;