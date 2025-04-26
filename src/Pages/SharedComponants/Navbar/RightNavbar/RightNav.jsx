import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import Loading from "../../../Loading/Loading";
import { FaComment } from "react-icons/fa";
import { IoClose } from "react-icons/io5"; // For modal close button

const RightNav = () => {
  const axiosSecure = useAxiosSecure();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

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

  // Fetch notices
  const { data: notices = [], isLoading: noticesLoading } = useQuery({
    queryKey: ["notices"],
    queryFn: async () => {
      const response = await axiosSecure.get("/admin/notices");
      return response.data;
    },
  });

  if (noticesLoading) return <Loading />;

  // Handle modal open for full post
  const handleModalOpen = (announcement) => {
    setSelectedAnnouncement(announcement);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedAnnouncement(null);
  };

  return (
    <div className="sticky top-0">
      <div className="pt-14  shrink-0 sticky top-0 z-10 bg-gray-50">
        <p className="text-6xl font-bold font-caveat pb-[66px]">Notifications !</p>
        <div className="space-y-6 py-6">
          {notices.map((announcement) => (
            <div
              key={announcement._id}
              className="bg-white shadow-md rounded-xl p-4 max-w-2xl mx-auto"
            >
              {/* Notification Header */}
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={announcement.user.photo}
                  alt="User"
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="text-sm">
                    {announcement.user.name}{" "} posted an Official Notice!
                  </p>
                  <p className="text-xs text-gray-500">
                    {getRelativeTime(announcement.createdAt)}
                  </p>
                </div>
              </div>

              {/* Notification Content */}
              <div className="mb-4">
                <p className="text-sm text-gray-700" style={{ whiteSpace: 'pre-wrap' }}>
                  {announcement.content
                    ? announcement.content.length > 50
                      ? `${announcement.content.slice(0, 50)}...`
                      : announcement.content
                    : "Added a photo."}
                </p>
              </div>

              {/* View Full Post Button */}
              <div className="mt-4 text-center">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => handleModalOpen(announcement)}
                >
                  View Full Post
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Full Post */}
      {modalOpen && selectedAnnouncement && (
        <div className="modal modal-open">
          <div className="modal-box">
            <button
              className="absolute top-2 right-2 text-gray-600"
              onClick={handleModalClose}
            >
              <IoClose size={24} />
            </button>

            <div className="flex items-center gap-4 mb-4">
              <img
                src={selectedAnnouncement.user.photo}
                alt="User"
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-medium">
                  {selectedAnnouncement.user.name}{" "}
                </p>
                <p className="text-sm text-gray-500">
                  {getRelativeTime(selectedAnnouncement.createdAt)}
                </p>
              </div>
            </div>

            {selectedAnnouncement.photo && (
              <img
                src={selectedAnnouncement.photo}
                alt="Full Post"
                className="w-full max-h-[300px] object-contain rounded-lg mb-4"
              />
            )}

            <p className="text-lg text-gray-800 mb-4" style={{ whiteSpace: 'pre-wrap' }}>
              {selectedAnnouncement.content}
            </p>

            <div className="flex justify-center items-center border-t border-gray-200 pt-4">
              <button className="flex items-center gap-2 text-gray-600 hover:text-green-500">
                <FaComment />
                <span>Comment</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RightNav;
