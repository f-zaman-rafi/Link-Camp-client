import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaComment } from "react-icons/fa";
import {
    BiUpvote,
    BiDownvote,
    BiSolidDownvote,
    BiSolidUpvote,
} from "react-icons/bi";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";
import useUserInfo from "../../Hooks/useUserInfo";
import Loading from "../Loading/Loading";
import { MdDeleteForever } from "react-icons/md";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { IoClose } from "react-icons/io5"; // For modal close button

const UserPosts = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const { userInfo } = useUserInfo();
    const MySwal = withReactContent(Swal);
    const [commentModalOpen, setCommentModalOpen] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [commentText, setCommentText] = useState("");

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
    const { data: userPosts = [], isLoading: postsLoading } = useQuery({
        queryKey: ['userPosts', user?.email],
        queryFn: async () => {
            const response = await axiosSecure.get(`/user/profile/${user?.email}`);
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

    // Fetch comments for selected post
    const { data: comments = [], isLoading: commentsLoading } = useQuery({
        queryKey: ["comments", selectedPostId],
        queryFn: async () => {
            if (!selectedPostId) return [];
            const response = await axiosSecure.get(`/comments/${selectedPostId}`);
            return response.data;
        },
        enabled: !!selectedPostId && commentModalOpen,
    });

    // Mutation for adding comments
    const addCommentMutation = useMutation({
        mutationFn: async ({ postId, content }) => {
            const response = await axiosSecure.post("/comments", { postId, content });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", selectedPostId] });
            setCommentText("");
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

    // Mutation for deleting a post
    const deletePostMutation = useMutation({
        mutationFn: async (postId) => {
            const response = await axiosSecure.delete(`/posts/${postId}`);
            return response.data;
        },
        onSuccess: () => {
            // Refetch posts after successful deletion
            queryClient.invalidateQueries({ queryKey: ['userPosts', user?.email] });
        },
    });

    const handleVote = (postId, voteType) => {
        voteMutation.mutate({ postId, voteType });
    };

    const handleDelete = (postId) => {
        MySwal.fire({
            title: 'Are you sure?',
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
        }).then((result) => {
            if (result.isConfirmed) {
                deletePostMutation.mutate(postId);
                MySwal.fire('Deleted!', 'Your post has been deleted.', 'success');
            } else {
                MySwal.fire('Cancelled', 'Your post is safe :)', 'error');
            }
        });
    };

    const openCommentsModal = (postId) => {
        setSelectedPostId(postId);
        setCommentModalOpen(true);
    };

    const closeCommentsModal = () => {
        setSelectedPostId(null);
        setCommentModalOpen(false);
        setCommentText("");
    };

    const handleAddComment = () => {
        if (!commentText.trim()) return;
        addCommentMutation.mutate({
            postId: selectedPostId,
            content: commentText,
        });
    };

    if (postsLoading || votesLoading || voteCountsLoading) return <Loading />;

    return (
        <div className="space-y-6 py-6 max-w-2xl mx-auto">
            {userPosts.length === 0 ? (
                <div className="flex justify-center items-center py-6">
                    <p className="text-gray-600 text-xl">No posts created by you yet.</p>
                </div>
            ) : (
                userPosts.map((post) => (
                    <div key={post._id} className="bg-white shadow-md rounded-xl p-4 mx-auto">
                        {/* Post Header */}
                        <div className="flex items-center gap-4 mb-4">
                            <img
                                src={userInfo.photo}
                                alt="User"
                                className="w-10 h-10 rounded-full"
                            />
                            <div>
                                <p className="font-medium">
                                    {userInfo.name}
                                    <span
                                        className={`mx-2 text-xs px-1 rounded-full
                                            ${userInfo.userType === "student" ? "bg-green-200" : ""}
                                            ${userInfo.userType === "teacher" ? "bg-blue-200" : ""}
                                            ${userInfo.userType === "admin" ? "bg-red-200" : ""}`}>
                                        {userInfo.userType}
                                    </span>
                                </p>
                                <p className="text-sm text-gray-500">{getRelativeTime(post.createdAt)}</p>
                            </div>
                        </div>

                        {/* Post Content */}
                        {post.photo ? (
                            <img
                                src={post.photo}
                                alt="Post"
                                className="w-full max-h-[300px] object-contain rounded-lg mb-4"
                            />
                        ) : (
                            <p className="text-gray-800 text-lg mb-4" style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>
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
                                    <span className="ml-2 text-sm">{voteCounts[post._id]?.upvotes || 0}</span>
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
                                    <span className="ml-2 text-sm">{voteCounts[post._id]?.downvotes || 0}</span>
                                </button>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    className="flex items-center gap-2 text-gray-600 hover:text-green-500"
                                    onClick={() => openCommentsModal(post._id)}
                                >
                                    <FaComment />
                                    <span>Comment</span>
                                </button>
                                <button
                                    onClick={() => handleDelete(post._id)}
                                    className="flex items-center gap-2 text-gray-600 hover:text-red-500"
                                >
                                    <MdDeleteForever />
                                    <span>Delete</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}

            {/* Comments Modal (Daisy UI) */}
            {commentModalOpen && selectedPostId && (
                <div className="modal modal-open">
                    <div className="modal-box w-full max-w-md max-h-[80vh] flex flex-col">
                        <button onClick={closeCommentsModal} className="btn btn-sm btn-circle absolute right-2 top-2">
                            ✕
                        </button>
                        <h3 className="font-bold text-lg">Comments</h3>
                        <div className="flex-1 overflow-y-auto py-4 space-y-4">
                            {commentsLoading ? (
                                <div className="flex justify-center items-center h-32">
                                    <span className="loading loading-spinner text-neutral"></span>
                                </div>
                            ) : comments.length === 0 ? (
                                <p className="text-gray-500">No comments yet.</p>
                            ) : (
                                comments.map((comment) => (
                                    <div key={comment._id} className="border-b pb-4 last:border-b-0">
                                        <div className="flex items-start gap-3">
                                            <div className="avatar">
                                                <div className="w-8 rounded-full">
                                                    <img src={comment.user.photo} alt={comment.user.name} />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-semibold">{comment.user.name}</p>
                                                <p className="text-xs text-gray-400">{getRelativeTime(comment.createdAt)}</p>
                                                <p className="mt-1">{comment.content}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="border-t pt-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Write a comment..."
                                    className="input input-bordered w-full"
                                    onPress={(e) => {
                                        if (e.key === 'Enter') handleAddComment();
                                    }}
                                />
                                <button
                                    onClick={handleAddComment}
                                    disabled={!commentText.trim() || addCommentMutation.isPending}
                                    className="btn btn-primary"
                                >
                                    {addCommentMutation.isPending ? 'Posting...' : 'Post'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserPosts;