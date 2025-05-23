import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const useCommentsOperations = (selectedPostId) => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [commentText, setCommentText] = useState("");

    // Fetch comments for a selected post
    const { data: comments = [], isLoading: commentsLoading } = useQuery({
        queryKey: ["comments", selectedPostId],
        queryFn: async () => {
            if (!selectedPostId) return [];
            const response = await axiosSecure.get(`/comments/${selectedPostId}`);
            return response.data;
        },
        enabled: !!selectedPostId,   // Only run the query when selectedPostId is valid
    });

    // Mutation to add a new comment
    const addCommentMutation = useMutation({
        mutationFn: async ({ postId, content }) => {
            const response = await axiosSecure.post("/comments", { postId, content });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", selectedPostId] });
            setCommentText("");
            toast.success("Comment added successfully!");
        },
    });

    // Handle add comment
    const handleAddComment = () => {
        if (!commentText.trim()) return;
        addCommentMutation.mutate({
            postId: selectedPostId,
            content: commentText,
        });
    };

    // Mutation to delete a comment
    const deleteCommentMutation = useMutation({
        mutationFn: async (commentId) => {
            const response = await axiosSecure.delete(`/comments/${commentId}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", selectedPostId] });
            toast.success("Comment deleted successfully!");
        },
    });

    // SweetAlert2 confirmation for deleting a comment
    const handleDeleteComment = (commentId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this action!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                deleteCommentMutation.mutate(commentId);
            }
        });
    };



    return {
        comments,
        commentsLoading,
        commentText,
        setCommentText,
        handleAddComment,
        handleDeleteComment,
        addCommentPending: addCommentMutation.isPending,
    };
};

export default useCommentsOperations;
