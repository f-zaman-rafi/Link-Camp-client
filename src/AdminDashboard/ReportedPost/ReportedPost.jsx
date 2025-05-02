import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaFlag, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import useRelativeTime from "../../Hooks/useRelativeTime";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Loading from "../../Pages/Loading/Loading";

// Set up SweetAlert2 instance with React support
const MySwal = withReactContent(Swal);

const ReportedPost = () => {
    // Custom secure Axios instance
    const axiosSecure = useAxiosSecure();

    // React Query client for cache manipulation
    const queryClient = useQueryClient();

    // Utility hook to format time relative to now (e.g., "3 hours ago")
    const getRelativeTime = useRelativeTime();


    // Fetch reported posts from server
    const { data: reportedPosts = [], isLoading: reportsLoading } = useQuery({
        queryKey: ["reported-posts"],
        queryFn: async () => {
            const response = await axiosSecure.get("/admin/reported-posts");
            return response.data;
        },
    });

    // Mutation to delete a reported post
    const deletePostMutation = useMutation({
        mutationFn: async (postId) => {
            const response = await axiosSecure.delete(`/admin/reported-posts/${postId}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["reported-posts"]);
        },
    });

    // Mutation to dismiss all reports for a post
    const dismissReportsMutation = useMutation({
        mutationFn: async (postId) => {
            const response = await axiosSecure.delete(`/admin/reported-posts/${postId}/dismiss`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["reported-posts"]);
        },
    });

    // Handle deletion confirmation and mutation
    const handleDeletePost = (postId) => {
        MySwal.fire({
            title: "Delete Post?",
            text: "Are you sure you want to delete this post? This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return deletePostMutation.mutateAsync(postId)
                    .then(() => {
                        return { isConfirmed: true };
                    })
                    .catch(error => {
                        MySwal.showValidationMessage(
                            `Request failed: ${error.message}`
                        );
                    });
            },
            allowOutsideClick: () => !MySwal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                MySwal.fire(
                    "Deleted!",
                    "The post has been deleted.",
                    "success"
                );
            }
        });
    };

    const handleDismissReports = (postId) => {
        MySwal.fire({
            title: "Dismiss Reports?",
            text: "Are you sure you want to dismiss all reports for this post? The post will remain visible.",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#f59e0b",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, dismiss reports",
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return dismissReportsMutation.mutateAsync(postId)
                    .then(() => {
                        return { isConfirmed: true };
                    })
                    .catch(error => {
                        MySwal.showValidationMessage(
                            `Request failed: ${error.message}`
                        );
                    });
            },
            allowOutsideClick: () => !MySwal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                MySwal.fire(
                    "Reports Dismissed!",
                    "All reports for this post have been dismissed.",
                    "success"
                );
            }
        });
    };

    // Show loading spinner while fetching reported posts
    if (reportsLoading) return <Loading />;

    return (
        <div className="lg:w-full w-auto space-y-6 py-4 px-6 min-h-screen">
            <h1 className="text-2xl font-bold text-start mb-6">Reported Posts</h1>

            {reportedPosts.length === 0 ? (
                <div className="flex justify-center items-center py-6 min-h-[50vh]">
                    <p className="text-gray-600 text-xl">No reported posts found.</p>
                </div>
            ) : (
                reportedPosts.map((post) => (
                    <div
                        key={post._id}
                        className="bg-white shadow-md rounded-xl p-4 w-auto lg:w-lg mx-auto relative"
                    >
                        {/* Report badge */}
                        <div className="absolute top-2 right-2 badge badge-error gap-2">
                            <FaFlag />
                            {post.reportCount} reports
                        </div>

                        {/* Post Header */}
                        <div className="flex items-center gap-4 mb-4">
                            <img
                                src={post.author?.photo || "/default-user.png"}
                                alt="User"
                                className="w-10 h-10 rounded-full"
                            />
                            <div>
                                <p className="font-medium">
                                    {post.author?.name || "Unknown User"}
                                    <span
                                        className={`mx-2 text-xs px-1 rounded-full
                                        ${post.author?.userType === "student" ? "bg-green-200" : ""}
                                        ${post.author?.userType === "teacher" ? "bg-blue-200" : ""}
                                        ${post.author?.userType === "admin" ? "bg-red-200" : ""}`}
                                    >
                                        {post.author?.userType || "unknown"}
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
                        <div className="flex gap-2">
                            <button
                                className="btn btn-error btn-sm"
                                onClick={() => handleDeletePost(post._id)}
                            >
                                <FaTrash />
                                Delete
                            </button>
                            <button
                                className="btn btn-warning btn-sm"
                                onClick={() => handleDismissReports(post._id)}
                            >
                                <FaFlag />
                                Dismiss
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ReportedPost;