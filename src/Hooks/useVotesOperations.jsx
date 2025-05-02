import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

const useVotesOperations = () => {
    const axiosSecure = useAxiosSecure(); // Custom hook for making authenticated API requests.
    const queryClient = useQueryClient(); // Access to the React Query cache to invalidate queries.

    // Fetch the current user's votes on different posts.
    const { data: userVotes = {}, isLoading: votesLoading } = useQuery({
        queryKey: ["votes"], // Key used to identify and manage this query in the cache.
        queryFn: async () => {
            const response = await axiosSecure.get("/votes"); // API endpoint to fetch user's votes.
            // Shape the data into an object where keys are postId and values are the voteType ('up' or 'down').
            return response.data.reduce((acc, vote) => {
                acc[vote.postId] = vote.voteType;
                return acc;
            }, {});
        },
    });

    // Fetch the counts of upvotes and downvotes for each post.
    const { data: voteCounts = {}, isLoading: voteCountsLoading } = useQuery({
        queryKey: ["voteCounts"], // Key used to identify and manage this query in the cache.
        queryFn: async () => {
            const response = await axiosSecure.get("/voteCounts"); // API endpoint to fetch vote counts.
            // Shape the data into an object where keys are postId and values are an object containing upvotes and downvotes.
            return response.data.reduce((acc, voteCount) => {
                acc[voteCount._id] = {
                    upvotes: voteCount.upvotes,
                    downvotes: voteCount.downvotes,
                };
                return acc;
            }, {});
        },
    });

    // Mutation to handle the action of voting on a post.
    const voteMutation = useMutation({
        mutationFn: async ({ postId, voteType }) => {
            const response = await axiosSecure.post("/votes", { postId, voteType }); // API endpoint to submit a vote.
            return response.data; // Optionally return data from the vote submission.
        },
        onSuccess: () => {
            // Invalidate the 'votes' and 'voteCounts' queries to trigger a refetch and update the UI.
            queryClient.invalidateQueries({ queryKey: ["votes"] });
            queryClient.invalidateQueries({ queryKey: ["voteCounts"] });
        },
    });

    // Function to trigger the vote mutation with the postId and voteType.
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