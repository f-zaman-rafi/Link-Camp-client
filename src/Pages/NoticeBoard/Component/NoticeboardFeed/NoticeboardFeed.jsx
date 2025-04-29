import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import Loading from "../../../Loading/Loading";
import { FaComment, FaTimes, FaTrash } from "react-icons/fa";
import useAuth from "../../../../Hooks/useAuth";
import useRelativeTime from "../../../../Hooks/useRelativeTime";
import useCommentsOperations from "../../../../Hooks/useCommentOperations";

const NoticeboardFeed = () => {
    const axiosSecure = useAxiosSecure();
    const [selectedPostId, setSelectedPostId] = useState(null);
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

    // Fetch notices
    const { data: posts = [], isLoading: postsLoading } = useQuery({
        queryKey: ["posts"],
        queryFn: async () => {
            const response = await axiosSecure.get("/admin/notices");
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

    const sortByLatest = (posts) => {
        return posts
            .slice()
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    };


    if (postsLoading) return <Loading />;

    return (
        <div className="space-y-6 py-6">
            {posts.length === 0 ? (
                <div className="flex justify-center items-center py-6 min-h-screen">
                    <p className="text-gray-600 text-xl">No notice available at the moment.</p>
                </div>
            ) : (
                sortByLatest(posts).map((notice) => (
                    <div
                        key={notice._id}
                        className="bg-white shadow-md rounded-xl p-4 max-w-2xl mx-auto"
                    >
                        {/* notice Header */}
                        <div className="flex items-center gap-4 mb-4">
                            <img
                                src={notice.user.photo}
                                alt="User"
                                className="w-10 h-10 rounded-full"
                            />
                            <div>
                                <p className="font-medium">
                                    {notice.user.name}
                                    <span className="mx-2 text-xs px-1 bg-green-200 rounded-full">
                                        {notice.user.user_type}
                                    </span>
                                </p>
                                <p className="text-sm text-gray-500">
                                    {getRelativeTime(notice.createdAt)}
                                </p>
                            </div>
                        </div>

                        {/* Post Content */}
                        {notice.photo && notice.content ? (
                            <>
                                <p className="mb-8" style={{ whiteSpace: 'pre-wrap' }}>
                                    {notice.content}
                                </p>
                                <img
                                    src={notice.photo}
                                    alt="notice"
                                    className="w-full max-h-[300px] object-contain rounded-lg mb-4"
                                />
                            </>
                        ) : notice.photo ? (
                            <img
                                src={notice.photo}
                                alt="notice"
                                className="w-full max-h-[300px] object-contain rounded-lg mb-4"
                            />
                        ) : notice.content ? (
                            <p className="mb-8" style={{ whiteSpace: 'pre-wrap' }}>
                                {notice.content}
                            </p>
                        ) : null}

                        {/* Comments Section - Same as Feed */}
                        <div className="flex justify-center items-center border-t border-gray-200 pt-4">
                            <button
                                className="flex items-center gap-2 text-gray-600 hover:text-green-500"
                                onClick={() => openCommentsModal(notice._id)}
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

export default NoticeboardFeed;