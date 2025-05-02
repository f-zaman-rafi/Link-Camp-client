import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; // Hooks for data fetching and state management.
import { FaComment } from "react-icons/fa"; // Comment icon.
import {
    BiUpvote,
    BiDownvote,
    BiSolidDownvote,
    BiSolidUpvote,
} from "react-icons/bi"; // Upvote and downvote icons.
import useAxiosSecure from "../../Hooks/useAxiosSecure"; // Custom hook for secure API requests.
import useAuth from "../../Hooks/useAuth"; // Custom hook for authentication context.
import useUserInfo from "../../Hooks/useUserInfo"; // Custom hook to get user information.
import Loading from "../Loading/Loading"; // Loading indicator component.
import { MdDeleteForever } from "react-icons/md"; // Delete icon.
import withReactContent from "sweetalert2-react-content"; // Integration for SweetAlert2 with React.
import Swal from "sweetalert2"; // Library for displaying elegant alerts.
import { FaTrash } from "react-icons/fa"; // Trash icon for deleting comments.
import useRelativeTime from "../../Hooks/useRelativeTime"; // Custom hook to display relative time (e.g., "5 minutes ago").
import useCommentsOperations from "../../Hooks/useCommentOperations"; // Custom hook for comment-related operations.
import useVotesOperations from "../../Hooks/useVotesOperations"; // Custom hook for voting-related operations.

const UserPosts = () => {
    const axiosSecure = useAxiosSecure(); // Instance for secure API calls.
    const queryClient = useQueryClient(); // Client for interacting with React Query cache.
    const { user } = useAuth(); // Logged-in user information.
    const { userInfo } = useUserInfo(); // Information about the logged-in user.
    const MySwal = withReactContent(Swal); // SweetAlert2 instance with React content support.
    const [commentModalOpen, setCommentModalOpen] = useState(false); // State to control the visibility of the comment modal.
    const [selectedPostId, setSelectedPostId] = useState(null); // State to store the ID of the post whose comments are being viewed.
    const getRelativeTime = useRelativeTime(); // Function to format timestamps into relative time.
    const {
        comments,
        commentsLoading,
        commentText,
        setCommentText,
        handleAddComment,
        handleDeleteComment,
        addCommentPending
    } = useCommentsOperations(selectedPostId); // Custom hook for managing comments for a specific post.
    const {
        userVotes,
        votesLoading,
        voteCounts,
        voteCountsLoading,
        handleVote,
    } = useVotesOperations(); // Custom hook for managing votes on posts.

    // Fetch posts created by the logged-in user.
    const { data: userPosts = [], isLoading: postsLoading } = useQuery({
        queryKey: ['userPosts', user?.email], // Unique key for the query, dependent on the user's email.
        queryFn: async () => {
            const response = await axiosSecure.get(`/user/profile/${user?.email}`); // API call to fetch user's posts.
            return response.data; // Return the fetched posts.
        },
    });

    // Mutation for deleting a post.
    const deletePostMutation = useMutation({
        mutationFn: async (postId) => {
            const response = await axiosSecure.delete(`/posts/${postId}`); // API call to delete a specific post.
            return response.data; // Return the response from the delete operation.
        },
        onSuccess: () => {
            // Invalidate relevant queries in the React Query cache after successful deletion.
            queryClient.invalidateQueries({ queryKey: ['userPosts', user?.email] });
            queryClient.invalidateQueries({ queryKey: ['votes'] });
            queryClient.invalidateQueries({ queryKey: ['voteCounts'] });
            queryClient.invalidateQueries({ queryKey: ['comments'] });
            queryClient.invalidateQueries({ queryKey: ['reports'] });
            // Reload the window after a short delay to ensure UI reflects the deletion.
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        },
    });

    // Function to handle the deletion of a post with a confirmation dialog.
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
                deletePostMutation.mutate(postId); // Trigger the delete post mutation.
                MySwal.fire('Deleted!', 'Your post has been deleted.', 'success'); // Show success message.
            } else {
                MySwal.fire('Cancelled', 'Your post is safe :)', 'error'); // Show cancellation message.
            }
        });
    };

    // Function to open the comments modal for a specific post.
    const openCommentsModal = (postId) => {
        setSelectedPostId(postId); // Set the ID of the post.
        setCommentModalOpen(true); // Open the modal.
    };

    // Function to close the comments modal.
    const closeCommentsModal = () => {
        setSelectedPostId(null); // Clear the selected post ID.
        setCommentModalOpen(false); // Close the modal.
        setCommentText(""); // Clear the comment input field.
    };

    // Function to sort posts by the latest creation date.
    const sortByLatest = (posts) => {
        return posts
            .slice()
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    };

    // Display loading indicator while posts, votes, or vote counts are being fetched.
    if (postsLoading || votesLoading || voteCountsLoading) return <Loading />;

    return (
        <div className="space-y-6 py-6 max-w-2xl mx-auto">
            {/* Display a message if the user has not created any posts yet. */}
            {userPosts.length === 0 ? (
                <div className="flex justify-center items-center py-6">
                    <p className="text-gray-600 text-xl">No posts created by you yet.</p>
                </div>
            ) : (
                /* Map through the user's posts and display each one. */
                sortByLatest(userPosts).map((post) => (
                    <div key={post._id} className="bg-white shadow-md rounded-xl p-4 mx-auto">
                        {/* Post Header: User info and timestamp */}
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

                        {/* Post Content: Text and/or image */}
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

                        {/* Post Actions: Voting, commenting, deleting */}
                        <div className="flex justify-between items-center border-t border-gray-200 pt-4">
                            <div className="flex items-center gap-4">
                                {/* Upvote button */}
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
                                {/* Downvote button */}
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
                                {/* Comment button */}
                                <button
                                    className="flex items-center gap-2 text-gray-600 hover:text-green-500"
                                    onClick={() => openCommentsModal(post._id)}
                                >
                                    <FaComment />
                                    <span>Comment</span>
                                </button>
                                {/* Delete button (only for the user's own posts) */}
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

            {/* Comments Modal */}
            {commentModalOpen && selectedPostId && (
                <div className="modal modal-open">
                    <div className="modal-box w-full max-w-md max-h-[80vh] flex flex-col">
                        <button onClick={closeCommentsModal} className="btn btn-sm btn-circle absolute right-2 top-2">
                            ✕
                        </button>
                        <h3 className="font-bold text-lg">Comments</h3>
                        <div className="flex-1 overflow-y-auto py-4 space-y-4">
                            {/* Loading indicator for comments */}
                            {commentsLoading ? (
                                <div className="flex justify-center items-center h-32">
                                    <span className="loading loading-spinner text-neutral"></span>
                                </div>
                            ) : comments.length === 0 ? (
                                /* Message if there are no comments */
                                <p className="text-gray-500">No comments yet.</p>
                            ) : (
                                /* Map through and display each comment */
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
                                                        <p className="font-semibold">{comment.user.name}</p>
                                                        <p className="text-xs text-gray-400">{getRelativeTime(comment.createdAt)}</p>
                                                        <p className="mt-1">{comment.content}</p>
                                                    </div>
                                                </div>
                                                {/* Delete button for own comments */}
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
                        {/* Comment input area */}
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

export default UserPosts;