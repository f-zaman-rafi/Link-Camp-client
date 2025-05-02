import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

const useReportOperations = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [reportReason, setReportReason] = useState("");

    // Handles reporting of a post with the given reason
    const reportMutation = useMutation({
        mutationFn: async ({ postId, reason }) => {
            const response = await axiosSecure.post("/reports", { postId, reason });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reports", selectedPostId] });
            setReportReason(""); // Clear report reason
            setReportModalOpen(false); // Close the report modal
            setSelectedPostId(null); // Reset selected post ID
        },
    });

    const handleReport = () => {
        if (!reportReason.trim()) return;
        reportMutation.mutate({
            postId: selectedPostId,
            reason: reportReason,
        });
    };

    const openReportModal = (postId) => {
        setSelectedPostId(postId);
        setReportModalOpen(true);
    };

    const closeReportModal = () => {
        setSelectedPostId(null);
        setReportModalOpen(false);
        setReportReason("");
    };

    return {
        reportModalOpen,
        selectedPostId,
        reportReason,
        setReportReason,
        handleReport,
        openReportModal,
        closeReportModal,
        isReporting: reportMutation.isPending,
    };
};

export default useReportOperations;
