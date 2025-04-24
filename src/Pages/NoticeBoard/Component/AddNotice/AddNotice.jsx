import React, { useState } from "react";
import useUserInfo from "../../../../Hooks/useUserInfo";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddNotice = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [content, setContent] = useState("");
    const [photo, setPhoto] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { userInfo } = useUserInfo();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setContent("");
        setPhoto(null);
    };

    const handlePhotoChange = (e) => {
        setPhoto(e.target.files[0]);
    };

    const handlePostSubmit = async () => {
        if (!content && !photo) {
            alert("Please add some content or upload a photo!");
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("content", content);
            if (photo) {
                formData.append("photo", photo);
            }

            await axiosSecure.post("/admin/notice", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast.success("Notice created successfully!");
            closeModal();
            navigate("/noticeboard");
        } catch (error) {
            console.error("Error creating noticeboard:", error.response?.data?.message || error.message);
            alert(error.response?.data?.message || "Failed to create noticeboard");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            {/* Main Add noticeboard Section */}
            <div className="bg-white p-4 rounded-xl shadow">
                <div className="flex items-center gap-4">
                    <img src={userInfo.photo} className="w-10 h-10 rounded-full" alt="User" />
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
                            <img src={userInfo.photo} className="w-10 h-10 rounded-full" alt="User" />
                            <p className="font-medium">{userInfo.name}</p>
                        </div>
                        <textarea
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
                                    Selected file: <span className="font-medium">{photo.name}</span>
                                </p>
                            )}
                        </div>
                        <div className="mt-4 border-t pt-4">
                            <div className="flex justify-end gap-2">
                                <button
                                    className="px-4 py-2 bg-gray-300 rounded-lg"
                                    onClick={closeModal}
                                    disabled={isLoading}>
                                    Cancel
                                </button>
                                <button
                                    className={`px-4 py-2 rounded-lg text-white ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
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