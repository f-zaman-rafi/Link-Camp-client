import { useCallback } from "react";

const useRelativeTime = () => {
    // Function to calculate and return relative time (e.g., "2 days ago", "3 hours ago")
    const getRelativeTime = useCallback((createdAt) => {
        const now = new Date();
        const postDate = new Date(createdAt);
        const diffInSeconds = Math.floor((now - postDate) / 1000);
        // If the post was created within the last minute
        if (diffInSeconds < 60) {
            return `${diffInSeconds} seconds ago`;
        }
        // If the post was created within the last hour
        else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
        }
        // If the post was created within the last day
        else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} hour${hours > 1 ? "s" : ""} ago`;
        }
        // If the post was created within the last month
        else if (diffInSeconds < 2592000) {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} day${days > 1 ? "s" : ""} ago`;
        }
        // If the post was created within the last year
        else if (diffInSeconds < 31536000) {
            const months = Math.floor(diffInSeconds / 2592000);
            return `${months} month${months > 1 ? "s" : ""} ago`;
        }
        // If the post was created more than a year ago
        else {
            const years = Math.floor(diffInSeconds / 31536000);
            return `${years} year${years > 1 ? "s" : ""} ago`;
        }
    }, []);

    return getRelativeTime;
};

export default useRelativeTime;
