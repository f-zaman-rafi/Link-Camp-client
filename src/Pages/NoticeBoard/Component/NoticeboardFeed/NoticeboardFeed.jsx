import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import Loading from "../../../Loading/Loading";
import { FaComment, FaTimes, FaTrash } from "react-icons/fa";
import useAuth from "../../../../Hooks/useAuth";

const NoticeboardFeed = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [selectedPostId, setSelectedPostId] = useState(null); // Using postId as in Feed
    const [commentText, setCommentText] = useState("");
    const { user } = useAuth();

    // Utility function to calculate relative time (same as Feed component)
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

    // Fetch notices (using the same query key for consistency, though data is different)
    const { data: posts = [], isLoading: postsLoading } = useQuery({
        queryKey: ["posts"],
        queryFn: async () => {
            const response = await axiosSecure.get("/admin/notices");
            return response.data;
        },
    });

    // Fetch comments for selected post (using postId as in Feed)
    const { data: comments = [], isLoading: commentsLoading } = useQuery({
        queryKey: ["comments", selectedPostId],
        queryFn: async () => {
            if (!selectedPostId) return [];
            const response = await axiosSecure.get(`/comments/${selectedPostId}`);
            return response.data;
        },
        enabled: !!selectedPostId,
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

    // Mutation for deleting comments
    const deleteCommentMutation = useMutation({
        mutationFn: async (commentId) => {
            const response = await axiosSecure.delete(`/comments/${commentId}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", selectedPostId] });
        },
    });

    const handleAddComment = () => {
        if (!commentText.trim()) return;
        addCommentMutation.mutate({
            postId: selectedPostId,
            content: commentText,
        });
    };

    const handleDeleteComment = (commentId) => {
        deleteCommentMutation.mutate(commentId);
    };

    const openCommentsModal = (postId) => {
        setSelectedPostId(postId);
    };

    const closeCommentsModal = () => {
        setSelectedPostId(null);
        setCommentText("");
    };

    if (postsLoading) return <Loading />;

    return (
        <div className="space-y-6 py-6">
            {posts.length === 0 ? (
                <div className="flex justify-center items-center py-6 min-h-screen">
                    <p className="text-gray-600 text-xl">No notice available at the moment.</p>
                </div>
            ) : (
                posts.map((announcement) => (
                    <div
                        key={announcement._id}
                        className="bg-white shadow-md rounded-xl p-4 max-w-2xl mx-auto"
                    >
                        {/* Announcement Header */}
                        <div className="flex items-center gap-4 mb-4">
                            <img
                                src={announcement.user.photo}
                                alt="User"
                                className="w-10 h-10 rounded-full"
                            />
                            <div>
                                <p className="font-medium">
                                    {announcement.user.name}
                                    <span className="mx-2 text-xs px-1 bg-green-200 rounded-full">
                                        {announcement.user.user_type}
                                    </span>
                                </p>
                                <p className="text-sm text-gray-500">
                                    {getRelativeTime(announcement.createdAt)}
                                </p>
                            </div>
                        </div>

                        {/* Announcement Content */}
                        {announcement.photo ? (
                            <img
                                src={announcement.photo}
                                alt="Announcement"
                                className="w-full max-h-[300px] object-contain rounded-lg mb-4"
                            />
                        ) : (
                            <p className="text-gray-800 text-lg mb-4" style={{ whiteSpace: 'pre-wrap' }}>{announcement.content}</p>
                        )}

                        {/* Comments Section - Same as Feed */}
                        <div className="flex justify-center items-center border-t border-gray-200 pt-4">
                            <button
                                className="flex items-center gap-2 text-gray-600 hover:text-green-500"
                                onClick={() => openCommentsModal(announcement._id)}
                            >
                                <FaComment />
                                <span>Comment</span>
                            </button>
                        </div>
                    </div>
                ))
            )}

            {/* Comments Modal - Same as Feed */}
            {selectedPostId && (
                <div className="modal modal-open">
                    <div className="modal-box w-full max-w-md max-h-[80vh] flex flex-col">
                        <div className="flex justify-between items-center border-b pb-2">
                            <h3 className="text-lg font-bold">Comments</h3>
                            <button onClick={closeCommentsModal} className="btn btn-sm btn-circle btn-ghost">
                                <FaTimes />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto py-4 space-y-4">
                            {commentsLoading ? (
                                <div className="flex justify-center items-center h-32">
                                    <span className="loading loading-spinner text-neutral"></span>
                                </div>
                            ) : comments.length === 0 ? (
                                <div className="flex justify-center items-center h-32">
                                    <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                                </div>
                            ) : (
                                comments.map((comment) => {
                                    const isMyComment = user?.email === comment.email;
                                    return (
                                        <div key={comment._id} className="border-b pb-4 last:border-b-0">
                                            <div className="flex items-start gap-3 justify-between">
                                                <div className="flex items-start gap-3">
                                                    <div className="avatar">
                                                        <div className="w-8 rounded-full">
                                                            <img src={comment.user.photo} alt={comment.user.name} />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-semibold">{comment.user.name}</p>
                                                            <span className="text-xs text-gray-400">
                                                                {getRelativeTime(comment.createdAt)}
                                                            </span>
                                                        </div>
                                                        <p className="mt-1">{comment.content}</p>
                                                    </div>
                                                </div>
                                                {isMyComment && (
                                                    <button
                                                        onClick={() => handleDeleteComment(comment._id)}
                                                        className="text-red-500 hover:text-red-700"
                                                        title="Delete Comment"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
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
                                    onKeyDown={(e) => {
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

export default NoticeboardFeed;