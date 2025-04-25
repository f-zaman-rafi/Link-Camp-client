import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import Loading from "../../../Loading/Loading";
import { FaComment } from "react-icons/fa";

const AnnouncementFeed = () => {
    const axiosSecure = useAxiosSecure();

    // Utility function to calculate relative time
    const getRelativeTime = (createdAt) => {
        const now = new Date();
        const postDate = new Date(createdAt);
        const diffInSeconds = Math.floor((now - postDate) / 1000);

        if (diffInSeconds < 60) {
            return `${diffInSeconds} seconds ago`;
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} hour${hours > 1 ? "s" : ""} ago`;
        } else if (diffInSeconds < 2592000) {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} day${days > 1 ? "s" : ""} ago`;
        } else if (diffInSeconds < 31536000) {
            const months = Math.floor(diffInSeconds / 2592000);
            return `${months} month${months > 1 ? "s" : ""} ago`;
        } else {
            const years = Math.floor(diffInSeconds / 31536000);
            return `${years} year${years > 1 ? "s" : ""} ago`;
        }
    };

    // Fetch announcements
    const { data: announcements = [], isLoading: announcementsLoading } = useQuery({
        queryKey: ["announcements"],
        queryFn: async () => {
            const response = await axiosSecure.get("/teacher/announcements");
            return response.data;
        },
    });

    if (announcementsLoading) return <Loading />;

    return (
        <div className="space-y-6 py-6">
            {announcements.map((announcement) => (
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
                                <span className="mx-2 text-xs px-1 bg-green-200 rounded-full">
                                    {announcement.user.user_type}
                                </span>
                            </p>
                            <p className="text-sm text-gray-500">
                                {getRelativeTime(announcement.createdAt)}
                            </p>
                        </div>
                    </div>

                    {/* Announcement Content */}
                    {announcement.photo ? (
                        <img
                            src={announcement.photo}
                            alt="Announcement"
                            className="w-full h-64 object-cover rounded-lg mb-4"
                        />
                    ) : (
                        <p className="text-gray-800 text-lg mb-4">{announcement.content}</p>
                    )}

                    {/* Comments Section */}
                    <div className="flex justify-center items-center border-t border-gray-200 pt-4">
                        <button className="flex items-center gap-2 text-gray-600 hover:text-green-500">
                            <FaComment />
                            <span>Comment</span>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AnnouncementFeed;