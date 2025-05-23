import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure"; // Custom hook for making authenticated API requests.
import Loading from "../../../Loading/Loading"; // Component to display a loading state.
import { FaComment } from "react-icons/fa"; // Importing the comment icon.
import { IoClose } from "react-icons/io5"; // Importing the close icon.
import useRelativeTime from "../../../../Hooks/useRelativeTime"; // Custom hook to format dates as relative time.
import useCommentsOperations from "../../../../Hooks/useCommentOperations"; // Custom hook for handling comment-related operations.

const RightNav = () => {
  const axiosSecure = useAxiosSecure();
  const [modalOpen, setModalOpen] = useState(false); // State to control the visibility of the full announcement modal.
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null); // State to store the announcement to be displayed in the modal.
  const [commentModalOpen, setCommentModalOpen] = useState(false); // State to control the visibility of the comments modal.
  const [selectedPostId, setSelectedPostId] = useState(null); // State to store the ID of the announcement for which comments are being viewed.
  const getRelativeTime = useRelativeTime(); // Function to format dates as relative time.
  const {
    comments,
    commentsLoading,
    commentText,
    setCommentText,
    handleAddComment,
    addCommentPending
  } = useCommentsOperations(selectedPostId); // Custom hook for managing comments.


  // Fetch notices
  const { data: notices = [], isLoading: noticesLoading } = useQuery({
    queryKey: ["notices"],
    queryFn: async () => {
      const response = await axiosSecure.get("/admin/notices"); // API endpoint to fetch admin notices.
      return response.data;
    },
  });


  const openCommentsModal = (postId) => {
    setSelectedPostId(postId); // Sets the selected announcement ID.
    setCommentModalOpen(true); // Opens the comments modal.
  };

  const closeCommentsModal = () => {
    setSelectedPostId(null); // Clears the selected announcement ID.
    setCommentModalOpen(false); // Closes the comments modal.
    setCommentText(""); // Clears the comment input field.
  };

  // Handle modal open for full post
  const handleModalOpen = (announcement) => {
    setSelectedAnnouncement(announcement); // Sets the announcement to be displayed.
    setModalOpen(true); // Opens the full announcement modal.
  };

  const handleModalClose = () => {
    setModalOpen(false); // Closes the full announcement modal.
    setSelectedAnnouncement(null); // Clears the selected announcement.
  };

  const sortByLatest = (posts) => {
    return posts
      .slice() // Creates a copy of the posts array.
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sorts the announcements by creation date in descending order (latest first).
  };

  if (noticesLoading) return <Loading />; // Displays a loading indicator while notices are being fetched.

  return (
    <div className="w-auto">
      <div className=" h-screen overflow-y-auto">
        <div className="sticky top-0 z-10 lg:bg-gray-50 bg-white pb-4">
          <div className="flex justify-center lg:py-7">
            <p className="text-3xl font-bold">Notifications!</p>
          </div>
        </div>
        <div className="space-y-6 py-6">
          {sortByLatest(notices).map((announcement) => (
            <div
              key={announcement._id}
              className="bg-white shadow-md rounded-xl p-4 w-xs lg:mr-20 mx-auto"
            >
              <div className="mx-4 md:mx-0">
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
                  onPress={(e) => {
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

export default RightNav;