import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import Loading from "../../../Loading/Loading";
import { FaComment } from "react-icons/fa";
import { IoClose } from "react-icons/io5"; // For modal close button

const RightNav = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null); // Using postId as in Feed
  const [commentText, setCommentText] = useState("");

  // Utility function to calculate relative time (same as Feed component)
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

  // Fetch comments for selected post
  const { data: comments = [], isLoading: commentsLoading } = useQuery({
    queryKey: ["comments", selectedPostId],
    queryFn: async () => {
      if (!selectedPostId) return [];
      const response = await axiosSecure.get(`/comments/${selectedPostId}`);
      return response.data;
    },
    enabled: !!selectedPostId && commentModalOpen, // Only fetch when the comment modal is open
  });

  // Mutation for adding comments
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

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    addCommentMutation.mutate({
      postId: selectedPostId,
      content: commentText,
    });
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

  // Handle modal open for full post
  const handleModalOpen = (announcement) => {
    setSelectedAnnouncement(announcement);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedAnnouncement(null);
  };

  if (noticesLoading) return <Loading />;

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
                    {announcement.user.name} posted an Official Notice!
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
                  {selectedAnnouncement.user.name}
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
              <button
                className="flex items-center gap-2 text-gray-600 hover:text-green-500"
                onClick={() => openCommentsModal(selectedAnnouncement._id)}
              >
                <FaComment />
                <span>Comment</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comments Modal (Daisy UI) */}
      {commentModalOpen && selectedPostId && (
        <div className="modal modal-open">
          <div className="modal-box w-full max-w-md max-h-[80vh] flex flex-col">
            <button onClick={closeCommentsModal} className="btn btn-sm btn-circle absolute right-2 top-2">
              ✕
            </button>
            <h3 className="font-bold text-lg">Comments</h3>
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {commentsLoading ? (
                <div className="flex justify-center items-center h-32">
                  <span className="loading loading-spinner text-neutral"></span>
                </div>
              ) : comments.length === 0 ? (
                <p className="text-gray-500">No comments yet.</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment._id} className="border-b pb-4 last:border-b-0">
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
                  </div>
                ))
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
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleAddComment();
                  }}
                />
                <button
                  onClick={handleAddComment}
                  disabled={!commentText.trim() || addCommentMutation.isPending}
                  className="btn btn-primary"
                >
                  {addCommentMutation.isPending ? 'Post' : 'Post'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RightNav;