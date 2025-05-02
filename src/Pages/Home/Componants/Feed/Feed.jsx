import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure"; // Custom hook for making authenticated API requests.
import { FaComment, FaFlag, FaTrash } from "react-icons/fa"; // Importing icons for comments, flags, and trash.
import {
    BiUpvote,
    BiDownvote,
    BiSolidDownvote,
    BiSolidUpvote,
} from "react-icons/bi"; // Importing icons for upvotes and downvotes.
import Loading from "../../../Loading/Loading"; // Component to display a loading state.
import useAuth from "../../../../Hooks/useAuth"; // Custom hook to manage user authentication state.
import useRelativeTime from "../../../../Hooks/useRelativeTime"; // Custom hook to format dates as relative time (e.g., "5 minutes ago").
import useCommentsOperations from "../../../../Hooks/useCommentOperations"; // Custom hook to handle comment-related operations.
import useVotesOperations from "../../../../Hooks/useVotesOperations"; // Custom hook to handle voting operations.

const Feed = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [selectedPostId, setSelectedPostId] = useState(null); // State to store the ID of the selected post for comments.
    const [reportModalOpen, setReportModalOpen] = useState(false); // State to control the visibility of the report modal.
    const [reportReason, setReportReason] = useState(""); // State to store the reason for reporting a post.
    const [postToReport, setPostToReport] = useState(null); // State to store the ID of the post being reported.
    const { user } = useAuth(); // Getting user information.
    const getRelativeTime = useRelativeTime(); // Function to format dates as relative time.
    const {
        comments,
        commentsLoading,
        commentText,
        setCommentText,
        handleAddComment,
        handleDeleteComment,
        addCommentPending
    } = useCommentsOperations(selectedPostId); // Custom hook for managing comments.
    const {
        userVotes,
        votesLoading,
        voteCounts,
        voteCountsLoading,
        handleVote,
    } = useVotesOperations(); // Custom hook for managing votes.

    // Fetch posts
    const { data: posts = [], isLoading: postsLoading } = useQuery({
        queryKey: ["posts"],
        queryFn: async () => {
            const response = await axiosSecure.get("/posts");
            return response.data;
        },
    });

    const openCommentsModal = (postId) => {
        setSelectedPostId(postId); // Sets the selected post ID and opens the comments modal.
    };

    const closeCommentsModal = () => {
        setSelectedPostId(null); // Clears the selected post ID and closes the comments modal.
        setCommentText(""); // Clears the comment text.
    };

    // --- Report Functionality ---
    const reportMutation = useMutation({
        mutationFn: async ({ postId, reason }) => {
            const response = await axiosSecure.post("/reports", { postId, reason });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reports", postToReport] }); // Invalidates the report query to refresh data.
            setReportReason(""); // Clears the report reason.
            setReportModalOpen(false); // Closes the report modal.
            setPostToReport(null); // Clears the post to report.
        },
    });

    const handleReport = () => {
        if (!reportReason.trim()) return; // Prevents reporting if the reason is empty.
        reportMutation.mutate({ postId: postToReport, reason: reportReason }); // Triggers the report mutation.
    };

    const openReportModal = (postId) => {
        setPostToReport(postId); // Sets the post to report.
        setReportModalOpen(true); // Opens the report modal.
    };

    const closeReportModal = () => {
        setReportModalOpen(false); // Closes the report modal.
        setReportReason(""); // Clears the report reason.
        setPostToReport(null); // Clears the post to report.
    };

    const getPostScore = (post) => {
        const now = new Date(); // Gets the current date and time.
        const postTime = new Date(post.createdAt); // Converts the post creation time to a Date object.
        const hoursSincePost = (now - postTime) / 1000 / 60 / 60; // Calculates the hours since the post was created.

        const upvotes = voteCounts[post._id]?.upvotes || 0; // Gets the number of upvotes for the post.
        const downvotes = voteCounts[post._id]?.downvotes || 0; // Gets the number of downvotes for the post.
        const netVotes = upvotes - downvotes; // Calculates the net votes.
        const commentCount = comments?.filter(c => c.postId === post._id).length || 0; // Gets the number of comments for the post.

        // Calculates a score for the post based on net votes, comment count, and time since creation.
        return (
            netVotes * 2 +
            commentCount * 1.5 -
            hoursSincePost * 0.4
        );
    };

    if (postsLoading || votesLoading || voteCountsLoading) return <Loading />; // Displays a loading indicator while data is being fetched.

    return (
        <div className="space-y-6 py-6">
            {posts.length === 0 ? (
                <div className="flex justify-center items-center py-6">
                    <p className="text-gray-600 text-xl">No post available at the moment.</p>
                </div>
            ) : (
                posts
                    .slice()
                    .sort((a, b) => getPostScore(b) - getPostScore(a)) // Sorts the posts based on their calculated score.
                    .map((post) => (

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
                            {post.photo && post.content ? (
                                <>
                                    <p className="mb-8" style={{ whiteSpace: 'pre-wrap' }}>
                                        {post.content}
                                    </p>
                                    <img
                                        src={post.photo}
                                        alt="Post"
                                        className="w-full max-h-[300px] object-contain rounded-lg mb-4"
                                    />
                                </>
                            ) : post.photo ? (
                                <img
                                    src={post.photo}
                                    alt="Post"
                                    className="w-full max-h-[300px] object-contain rounded-lg mb-4"
                                />
                            ) : post.content ? (
                                <p className="mb-8" style={{ whiteSpace: 'pre-wrap' }}>
                                    {post.content}
                                </p>
                            ) : null}


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

