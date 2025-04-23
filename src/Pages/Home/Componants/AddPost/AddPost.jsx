import React, { useState } from "react";
import { FaPhotoVideo, FaSmile, FaUserFriends } from "react-icons/fa";
import useUserInfo from "../../../../Hooks/useUserInfo";

const AddPost = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userInfo } = useUserInfo();
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
              <img
                src="/user.jpg"
                className="w-10 h-10 rounded-full"
                alt="User"
              />
              <p className="font-medium">Your Name</p>
            </div>
            <textarea
              className="w-full p-3 border rounded-lg outline-none"
              rows="4"
              placeholder="What's on your mind?"
            ></textarea>
            <div className="mt-4 border-t pt-4">
              <div className="flex items-center gap-4 mb-4">
                <button className="flex items-center gap-2 text-blue-500">
                  <FaPhotoVideo />
                  Photo/Video
                </button>
                <button className="flex items-center gap-2 text-yellow-500">
                  <FaSmile />
                  Feeling/Activity
                </button>
                <button className="flex items-center gap-2 text-green-500">
                  <FaUserFriends />
                  Tag Friends
                </button>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                  Post
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
