import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure"; // Custom hook for making authenticated API requests.
import Loading from "../../../Loading/Loading"; // Component to display a loading state.
import { FaComment, FaTimes, FaTrash } from "react-icons/fa"; // Icons for comment, close, and delete actions.
import useAuth from "../../../../Hooks/useAuth"; // Custom hook to get authentication information.
import useRelativeTime from "../../../../Hooks/useRelativeTime"; // Custom hook to format timestamps into relative time (e.g., "2 hours ago").
import useCommentsOperations from "../../../../Hooks/useCommentOperations"; // Custom hook for handling comment-related operations.

const AnnouncementFeed = () => {
    const axiosSecure = useAxiosSecure(); // Instance for making secure API calls.
    const [selectedPostId, setSelectedPostId] = useState(null); // State to track the ID of the post whose comments are being viewed.
    const { user } = useAuth(); // Get user information.
    const getRelativeTime = useRelativeTime(); // Function to format timestamps.
    const {
        comments,
        commentsLoading,
        commentText,
        setCommentText,
        handleAddComment,
        handleDeleteComment,
        addCommentPending
    } = useCommentsOperations(selectedPostId); // Custom hook providing comment data and operations for the selected post.

    // Fetch announcements from the server.
    const { data: posts = [], isLoading: postsLoading } = useQuery({
        queryKey: ["posts"], // Key used to identify and manage this query in the cache.
        queryFn: async () => {
            const response = await axiosSecure.get("/teacher/announcements"); // API endpoint to fetch announcements.
            return response.data; // Return the fetched announcement data.
        },
    });

    // Function to open the comments modal for a specific post.
    const openCommentsModal = (postId) => {
        setSelectedPostId(postId);
    };

    // Function to close the comments modal.
    const closeCommentsModal = () => {
        setSelectedPostId(null);
        setCommentText(""); // Clear the comment input field when the modal is closed.
    };

    // Function to sort announcements by the latest creation date.
    const sortByLatest = (posts) => {
        return posts
            .slice()
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    };

    // Show loading indicator while fetching announcements.
    if (postsLoading) return <Loading />;

    return (
        <div className="space-y-6 py-6">
            {posts.length === 0 ? (
                <div className="flex justify-center items-center py-6 min-h-screen">
                    <p className="text-gray-600 text-xl">No announcement available at the moment.</p>
                </div>
            ) : (
                sortByLatest(posts).map((announcement) => (
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
                                    <span className="mx-2 text-xs px-1 bg-blue-200 rounded-full">
                                        {announcement.user.user_type}
                                    </span>
                                </p>
                                <p className="text-sm text-gray-500">
                                    {getRelativeTime(announcement.createdAt)}
                                </p>
                            </div>
                        </div>

                        {/* announcement Content */}
                        {announcement.photo && announcement.content ? (
                            <>
                                <p className="mb-8" style={{ whiteSpace: 'pre-wrap' }}>
                                    {announcement.content}
                                </p>
                                <img
                                    src={announcement.photo}
                                    alt="announcement"
                                    className="w-full max-h-[300px] object-contain rounded-lg mb-4"
                                />
                            </>
                        ) : announcement.photo ? (
                            <img
                                src={announcement.photo}
                                alt="announcement"
                                className="w-full max-h-[300px] object-contain rounded-lg mb-4"
                            />
                        ) : announcement.content ? (
                            <p className="mb-8" style={{ whiteSpace: 'pre-wrap' }}>
                                {announcement.content}
                            </p>
                        ) : null}


                        {/* Comments Section - Same as Feed */}
                        <div className="flex justify-center items-center border-t border-gray-200 pt-4">
                            <button
                                className="flex items-center gap-2 text-gray-600 hover:text-green-500"
                                onClick={() => openCommentsModal(announcement._id)} // Using announcement._id as postId
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
        </div>
    );
};

export default AnnouncementFeed;