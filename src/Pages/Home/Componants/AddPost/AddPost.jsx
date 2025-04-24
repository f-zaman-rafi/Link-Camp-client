import React, { useState } from "react";
import { FaPhotoVideo, FaSmile, FaUserFriends } from "react-icons/fa";
import useUserInfo from "../../../../Hooks/useUserInfo";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";

const AddPost = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [content, setContent] = useState(""); // For post content
  const [photo, setPhoto] = useState(null); // For photo upload
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const { userInfo } = useUserInfo();
  const axiosSecure = useAxiosSecure();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setContent(""); // Reset content
    setPhoto(null); // Reset photo
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]); // Store the selected photo
  };

  const handlePostSubmit = async () => {
    if (!content && !photo) {
      alert("Please add some content or upload a photo!");
      return;
    }

    setIsLoading(true); // Start loading
    try {
      const formData = new FormData();
      formData.append("content", content);
      if (photo) {
        formData.append("photo", photo);
      }

      const response = await axiosSecure.post("/user/post", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Post created:", response.data);
      alert("Post created successfully!");
      closeModal(); // Close modal after successful post
    } catch (error) {
      console.error("Error creating post:", error.response?.data?.message || error.message);
      alert(error.response?.data?.message || "Failed to create post");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div>
      {/* Main Add Post Section */}
      <div className="bg-white p-4 rounded-xl shadow">
        <div className="flex items-center gap-4">
          <img src={userInfo.photo} className="w-10 h-10 rounded-full" alt="User" />
          <input
            type="text"
            placeholder="What's on your mind?"
            className="flex-1 bg-gray-100 p-3 rounded-full outline-none"
            onClick={openModal} // Open modal on click
          />
        </div>
        <div className="mt-4 flex justify-between px-5">
          <button className="text-blue-500">📷 Photo</button>
          <button className="text-green-500">🎥 Video</button>
          <button className="text-yellow-500">😊 Feeling</button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Create Post</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={closeModal}
              >
                ✖
              </button>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <img src={userInfo.photo} className="w-10 h-10 rounded-full" alt="User" />
              <p className="font-medium">{userInfo.name}</p>
            </div>
            <textarea
              className="w-full p-3 border rounded-lg outline-none"
              rows="4"
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)} // Update content state
            ></textarea>
            <div className="mt-4">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange} // Handle photo upload
                className="mb-4"
              />
            </div>
            <div className="mt-4 border-t pt-4">
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                  onClick={closeModal}
                  disabled={isLoading} // Disable button while loading
                >
                  Cancel
                </button>
                <button
                  className={`px-4 py-2 rounded-lg text-white ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  onClick={handlePostSubmit}
                  disabled={isLoading} // Disable button while loading
                >
                  {isLoading ? "Posting..." : "Post"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPost;