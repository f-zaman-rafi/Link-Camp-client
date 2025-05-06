import React, { useRef, useState } from "react";
import useUserInfo from "../../../../Hooks/useUserInfo"; // Custom hook to get user information.
import useAxiosSecure from "../../../../Hooks/useAxiosSecure"; // Custom hook for making authenticated API requests.
import toast from "react-hot-toast"; // Library for displaying user-friendly notifications.
import { useNavigate } from "react-router-dom"; // Hook for navigating between routes.
import Loading from "../../../Loading/Loading";

const AddNotice = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the visibility of the add notice modal.
  const [content, setContent] = useState(""); // State to store the text content of the notice.
  const [photo, setPhoto] = useState(null); // State to store the selected photo file for the notice.
  const [isLoading, setIsLoading] = useState(false); // State to track if the notice is being submitted.
  const { userInfo, isLoading: userInfoLoading } = useUserInfo(); // Get user information, including photo and name.
  const axiosSecure = useAxiosSecure(); // Instance for making secure API calls.
  const navigate = useNavigate(); // Function to navigate to different routes.
  const textareaRef = useRef(null); // Ref to the textarea element for focusing.

  const openModal = () => {
    setIsModalOpen(true); // Open the add notice modal.
    setTimeout(() => {
      textareaRef.current?.focus(); // Focus on the textarea after the modal opens.
    }, 100);
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the add notice modal.
    setContent(""); // Clear the content state.
    setPhoto(null); // Clear the selected photo state.
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]); // Update the photo state with the selected file.
  };

  const handlePostSubmit = async () => {
    // Prevent submitting if neither content nor a photo is provided.
    if (!content && !photo) {
      alert("Please add some content or upload a photo!");
      return;
    }

    setIsLoading(true); // Set loading state to true during the API call.
    try {
      const formData = new FormData(); // Create FormData to handle file uploads.
      formData.append("content", content); // Append the text content to the FormData.
      if (photo) {
        formData.append("photo", photo); // Append the photo file to the FormData if one is selected.
      }

      // Post the admin notice data to the server.
      await axiosSecure.post("/admin/notice", formData, {
        headers: { "Content-Type": "multipart/form-data" }, // Set the correct content type for file uploads.
      });

      toast.success("Notice created successfully!"); // Show a success notification.
      window.location.reload(); // Force a page reload to update the noticeboard.
      navigate("/"); // Optionally navigate to the home page after posting.
    } catch (error) {
      // Log and display an error message if the notice creation fails.
      console.error(
        "Error creating noticeboard:",
        error.response?.data?.message || error.message
      );
      alert(error.response?.data?.message || "Failed to create noticeboard");
    } finally {
      setIsLoading(false); // Set loading state back to false after the API call completes.
    }
  };

  if (userInfoLoading) return <Loading />;

  return (
    <div>
      {/* Main Add noticeboard Section */}
      <div className="bg-white p-4 rounded-xl  max-w-2xl mx-auto  shadow">
        <div className="flex items-center gap-4">
          <img
            src={userInfo.photo}
            className="w-10 h-10 rounded-full"
            alt="User"
          />
          <input
            type="text"
            placeholder="Publish an Official Notice!"
            className="flex-1 bg-gray-100 p-3 rounded-full outline-none"
            onClick={openModal}
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
              <h2 className="text-xl font-bold">Publish Official Notice</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={closeModal}
              >
                ✖
              </button>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <img
                src={userInfo.photo}
                className="w-10 h-10 rounded-full"
                alt="User"
              />
              <p className="font-medium">{userInfo.name}</p>
            </div>
            <textarea
              ref={textareaRef}
              className="w-full p-3 border rounded-lg outline-none"
              rows="4"
              placeholder="Publish an Official-Notice!"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
            <div className="mt-4">
              <label
                htmlFor="photo-upload"
                className="flex items-center gap-2 px-4 py-2 bg-none text-gray-600 border rounded-lg cursor-pointer hover:bg-blue-200"
              >
                📷 Upload Photo
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              {photo && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected file:{" "}
                  <span className="font-medium">{photo.name}</span>
                </p>
              )}
            </div>
            <div className="mt-4 border-t pt-4">
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                  onClick={closeModal}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  className={`px-4 py-2 rounded-lg text-white ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                  onClick={handlePostSubmit}
                  disabled={isLoading}
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

export default AddNotice;
