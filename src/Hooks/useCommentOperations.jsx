import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

const useCommentOperations = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [commentModalOpen, setCommentModalOpen] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [commentText, setCommentText] = useState("");

    const { data: comments = [], isLoading: commentsLoading } = useQuery({
        queryKey: ["comments", selectedPostId],
        queryFn: async () => {
            if (!selectedPostId) return [];
            const response = await axiosSecure.get(`/comments/${selectedPostId}`);
            return response.data;
        },
        enabled: !!selectedPostId && commentModalOpen,
    });

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
        setCommentModalOpen(true);
    };

    const closeCommentsModal = () => {
        setSelectedPostId(null);
        setCommentModalOpen(false);
        setCommentText("");
    };

    return {
        commentModalOpen,
        selectedPostId,
        commentText,
        comments,
        commentsLoading,
        setCommentText,
        handleAddComment,
        handleDeleteComment, // Added delete comment handler
        openCommentsModal,
        closeCommentsModal,
        isAddingComment: addCommentMutation.isPending, // Optional: for UI feedback
        isDeletingComment: deleteCommentMutation.isPending, // Optional: for UI feedback
    };
};

export default useCommentOperations;