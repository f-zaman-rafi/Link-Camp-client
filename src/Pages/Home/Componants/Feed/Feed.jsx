import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import { FaComment, FaFlag, FaTrash } from "react-icons/fa";
import {
    BiUpvote,
    BiDownvote,
    BiSolidDownvote,
    BiSolidUpvote,
} from "react-icons/bi";
import Loading from "../../../Loading/Loading";
import useAuth from "../../../../Hooks/useAuth";
import useRelativeTime from "../../../../Hooks/useRelativeTime";
import useCommentsOperations from "../../../../Hooks/useCommentOperations";
import useVotesOperations from "../../../../Hooks/useVotesOperations";

const Feed = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [reportReason, setReportReason] = useState("");
    const [postToReport, setPostToReport] = useState(null);
    const { user } = useAuth();
    const getRelativeTime = useRelativeTime();
    const {
        comments,
        commentsLoading,
        commentText,
        setCommentText,
        handleAddComment,
        handleDeleteComment,
        addCommentPending
    } = useCommentsOperations(selectedPostId);
    const {
        userVotes,
        votesLoading,
        voteCounts,
        voteCountsLoading,
        handleVote,
    } = useVotesOperations();

    // Fetch posts
    const { data: posts = [], isLoading: postsLoading } = useQuery({
        queryKey: ["posts"],
        queryFn: async () => {
            const response = await axiosSecure.get("/posts");
            return response.data;
        },
    });



    const openCommentsModal = (postId) => {
        setSelectedPostId(postId);
    };

    const closeCommentsModal = () => {
        setSelectedPostId(null);
        setCommentText("");
    };

    // --- Report Functionality ---
    const reportMutation = useMutation({
        mutationFn: async ({ postId, reason }) => {
            const response = await axiosSecure.post("/reports", { postId, reason });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reports", postToReport] });
            setReportReason("");
            setReportModalOpen(false);
            setPostToReport(null);
        },
    });

    const handleReport = () => {
        if (!reportReason.trim()) return;
        reportMutation.mutate({ postId: postToReport, reason: reportReason });
    };

    const openReportModal = (postId) => {
        setPostToReport(postId);
        setReportModalOpen(true);
    };

    const closeReportModal = () => {
        setReportModalOpen(false);
        setReportReason("");
        setPostToReport(null);
    };

    if (postsLoading || votesLoading || voteCountsLoading) return <Loading />;

    return (
        <div className="space-y-6 py-6">
            {posts.length === 0 ? (
                <div className="flex justify-center items-center py-6 min-h-screen">
                    <p className="text-gray-600 text-xl">No post available at the moment.</p>
                </div>
            ) : (
                posts.map((post) => (
                    <div
                        key={post._id}
                        className="bg-white shadow-md rounded-xl p-4 max-w-2xl mx-auto"
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
                                        ${post.user.user_type === "admin" ? "bg-red-200" : ""}`}
                                    >
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
                                <button
                                    className="flex items-center gap-2 text-gray-600 hover:text-green-500"
                                    onClick={() => openCommentsModal(post._id)}
                                >
                                    <FaComment />
                                    <span>Comment</span>
                                </button>
                                <button
                                    className="flex items-center gap-2 text-gray-600 hover:text-yellow-500"
                                    onClick={() => openReportModal(post._id)}
                                >
                                    <FaFlag />
                                    <span>Report</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}

            {/* Comments Modal */}
            {selectedPostId && (
                <div className="modal modal-open">
                    <div className="modal-box w-full max-w-md max-h-[80vh] flex flex-col">
                        <div className="flex justify-between items-center border-b pb-2">
                            <h3 className="text-lg font-bold">Comments</h3>
                            <button onClick={closeCommentsModal} className="btn btn-sm btn-circle btn-ghost">
                                ✕
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
                                }
                                ))}

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
                                    disabled={!commentText.trim() || addCommentPending}
                                    className="btn btn-primary"
                                >
                                    {addCommentPending ? 'Posting...' : 'Post'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Report Modal */}
            {reportModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Report Post</h3>
                        <textarea
                            value={reportReason}
                            onChange={(e) => setReportReason(e.target.value)}
                            placeholder="Enter your reason for reporting this post..."
                            className="textarea textarea-bordered w-full h-32 mb-4"
                        />
                        <div className="flex justify-end gap-4">
                            <button
                                className="btn btn-outline"
                                onClick={closeReportModal}
                                disabled={reportMutation.isPending}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-error"
                                onClick={handleReport}
                                disabled={!reportReason.trim() || reportMutation.isPending}
                            >
                                {reportMutation.isPending ? "Reporting..." : "Report"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Feed;

