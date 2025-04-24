import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import { FaComment, FaFlag } from "react-icons/fa";
import {
    BiUpvote,
    BiDownvote,
    BiSolidDownvote,
    BiSolidUpvote,
} from "react-icons/bi";
import Loading from "../../../Loading/Loading";

const Feed = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    // Utility function to calculate relative time
    const getRelativeTime = (createdAt) => {
        const now = new Date();
        const postDate = new Date(createdAt);
        const diffInSeconds = Math.floor((now - postDate) / 1000);

        if (diffInSeconds < 60) {
            return `${diffInSeconds} seconds ago`;
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} hour${hours > 1 ? "s" : ""} ago`;
        } else if (diffInSeconds < 2592000) {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} day${days > 1 ? "s" : ""} ago`;
        } else if (diffInSeconds < 31536000) {
            const months = Math.floor(diffInSeconds / 2592000);
            return `${months} month${months > 1 ? "s" : ""} ago`;
        } else {
            const years = Math.floor(diffInSeconds / 31536000);
            return `${years} year${years > 1 ? "s" : ""} ago`;
        }
    };

    // Fetch posts
    const { data: posts = [], isLoading: postsLoading } = useQuery({
        queryKey: ["posts"],
        queryFn: async () => {
            const response = await axiosSecure.get("/posts");
            return response.data;
        },
    });

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
            // Refetch votes and vote counts after a successful mutation
            queryClient.invalidateQueries({ queryKey: ["votes"] });
            queryClient.invalidateQueries({ queryKey: ["voteCounts"] });
        },
    });

    const handleVote = (postId, voteType) => {
        voteMutation.mutate({ postId, voteType });
    };

    if (postsLoading || votesLoading || voteCountsLoading) return <Loading />;

    return (
        <div className="space-y-6 py-6">
            {posts.map((post) => (
                <div
                    key={post._id}
                    className="bg-white shadow-md rounded-lg p-4 max-w-2xl mx-auto"
                >
                    {/* Post Header */}
                    <div className="flex items-center gap-4 mb-4">
                        <img
                            src={post.user.photo}
                            alt="User"
                            className="w-10 h-10 rounded-full"
                        />
                        <div>
                            <p className="font-medium">
                                {post.user.name}
                                <span
                                    className={`mx-2 text-xs px-1 rounded-full
                                        ${post.user.user_type === "student" ? "bg-green-200" : ""}    
                                        ${post.user.user_type === "teacher" ? "bg-blue-200" : ""}    
                                        ${post.user.user_type === "admin" ? "bg-red-200" : ""}`}>
                                    {post.user.user_type}
                                </span>
                            </p>
                            <p className="text-sm text-gray-500">
                                {getRelativeTime(post.createdAt)}
                            </p>
                        </div>
                    </div>

                    {/* Post Content */}
                    {post.photo ? (
                        <img
                            src={post.photo}
                            alt="Post"
                            className="w-full h-64 object-cover rounded-lg mb-4"
                        />
                    ) : (
                        <p className="text-gray-800 text-lg mb-4">{post.content}</p>
                    )}

                    {/* Post Actions */}
                    <div className="flex justify-between items-center border-t border-gray-200 pt-4">
                        <div className="flex items-center gap-4">
                            <button
                                className={`flex items-center justify-center ${userVotes[post._id] === "upvote"
                                    ? "text-blue-500"
                                    : "text-gray-600 hover:text-blue-500"
                                    }`}
                                onClick={() => handleVote(post._id, "upvote")}
                            >
                                {userVotes[post._id] === "upvote" ? (
                                    <BiSolidUpvote className="text-xl" />
                                ) : (
                                    <BiUpvote className="text-xl" />
                                )}
                                <span className="ml-2 text-sm">
                                    {voteCounts[post._id]?.upvotes || 0}
                                </span>
                            </button>
                            <button
                                className={`flex items-center justify-center ${userVotes[post._id] === "downvote"
                                    ? "text-red-500"
                                    : "text-gray-600 hover:text-red-500"
                                    }`}
                                onClick={() => handleVote(post._id, "downvote")}
                            >
                                {userVotes[post._id] === "downvote" ? (
                                    <BiSolidDownvote className="text-xl" />
                                ) : (
                                    <BiDownvote className="text-xl" />
                                )}
                                <span className="ml-2 text-sm">
                                    {voteCounts[post._id]?.downvotes || 0}
                                </span>
                            </button>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="flex items-center gap-2 text-gray-600 hover:text-green-500">
                                <FaComment />
                                <span>Comment</span>
                            </button>
                            <button className="flex items-center gap-2 text-gray-600 hover:text-yellow-500">
                                <FaFlag />
                                <span>Report</span>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Feed;
