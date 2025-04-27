import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

const useVotesOperations = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    // Fetch user votes
    const { data: userVotes = {}, isLoading: votesLoading } = useQuery({
        queryKey: ["votes"],
        queryFn: async () => {
            const response = await axiosSecure.get("/votes");
            return response.data.reduce((acc, vote) => {
                acc[vote.postId] = vote.voteType;
                return acc;
            }, {});
        },
    });

    // Fetch vote counts
    const { data: voteCounts = {}, isLoading: voteCountsLoading } = useQuery({
        queryKey: ["voteCounts"],
        queryFn: async () => {
            const response = await axiosSecure.get("/voteCounts");
            return response.data.reduce((acc, voteCount) => {
                acc[voteCount._id] = {
                    upvotes: voteCount.upvotes,
                    downvotes: voteCount.downvotes,
                };
                return acc;
            }, {});
        },
    });

    // Mutation for handling votes
    const voteMutation = useMutation({
        mutationFn: async ({ postId, voteType }) => {
            const response = await axiosSecure.post("/votes", { postId, voteType });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["votes"] });
            queryClient.invalidateQueries({ queryKey: ["voteCounts"] });
        },
    });

    // Function to handle vote actions
    const handleVote = (postId, voteType) => {
        voteMutation.mutate({ postId, voteType });
    };

    return {
        userVotes,
        votesLoading,
        voteCounts,
        voteCountsLoading,
        handleVote,

    };
};

export default useVotesOperations;
