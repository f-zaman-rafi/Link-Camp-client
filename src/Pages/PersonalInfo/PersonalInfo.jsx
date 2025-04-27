import React, { useState } from 'react';
import { FaEdit, FaTimes } from 'react-icons/fa';
import useUserInfo from '../../Hooks/useUserInfo';
import Loading from '../Loading/Loading';


const PersonalInfo = () => {
    const { userInfo, isLoading } = useUserInfo();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    if (isLoading) return <Loading />;

    const handleEditClick = () => {
        if (userInfo.userType === "admin") {
            setErrorMessage("You're the admin, dude! Go to the database and change it there, no need to ask me!");
        } else {
            setErrorMessage("Please contact administration to edit personal information.");
        }
    };

    return (
        <div className="min-h-screen p-6 rounded-lg">
            {/* Profile Header */}
            <div className="relative bg-white shadow-md rounded-lg overflow-hidden">
                {/* Cover Photo */}
                <div className="h-48 bg-gray-300 relative">
                    <img
                        src={userInfo.photo}
                        alt="Cover"
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => setIsModalOpen(true)}
                    />

                </div>
            </div>

            {/* User Info */}
            <div className="mt-16 bg-white shadow-md rounded-xl p-6 relative">
                <div>
                    <p className='text-2xl font-medium'>Personal Information</p>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-6">
                    <div className="mb-4">
                        <label className="text-sm text-gray-600" htmlFor="name">Name</label>
                        <input
                            id="name"
                            type="text"
                            value={userInfo.name}
                            className="w-full p-2 mt-2 border border-gray-300 rounded-lg bg-gray-200 cursor-not-allowed"
                            readOnly
                            onClick={handleEditClick}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="text-sm text-gray-600" htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="text"
                            value={userInfo.email}
                            className="w-full p-2 mt-2 border border-gray-300 rounded-lg bg-gray-200 cursor-not-allowed"
                            readOnly
                            onClick={handleEditClick}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="text-sm text-gray-600" htmlFor="userType">User Type</label>
                        <input
                            id="userType"
                            type="text"
                            value={userInfo.userType}
                            className="w-full p-2 mt-2 border border-gray-300 rounded-lg bg-gray-200 cursor-not-allowed"
                            readOnly
                            onClick={handleEditClick}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="text-sm text-gray-600" htmlFor="verify">Verify</label>
                        <input
                            id="verify"
                            type="text"
                            value={userInfo.verify}
                            className="w-full p-2 mt-2 border border-gray-300 rounded-lg bg-gray-200 cursor-not-allowed"
                            readOnly
                            onClick={handleEditClick}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="text-sm text-gray-600" htmlFor="department">Department</label>
                        <input
                            id="department"
                            type="text"
                            value={userInfo.department}
                            className="w-full p-2 mt-2 border border-gray-300 rounded-lg bg-gray-200 cursor-not-allowed"
                            readOnly
                            onClick={handleEditClick}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="text-sm text-gray-600" htmlFor="user_id">User ID</label>
                        <input
                            id="user_id"
                            type="text"
                            value={userInfo.user_id}
                            className="w-full p-2 mt-2 border border-gray-300 rounded-lg bg-gray-200 cursor-not-allowed"
                            readOnly
                            onClick={handleEditClick}
                        />
                    </div>
                </div>

                {/* Error Message */}
                {errorMessage && (
                    <div className="mt-4 text-red-600">
                        <p>{errorMessage}</p>
                    </div>
                )}
            </div>

            {/* Modal for Full-Size Photo */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="relative">
                        <img
                            src={userInfo.photo}
                            alt="Full Size"
                            className="max-w-full max-h-screen rounded-lg"
                        />
                        <button
                            className="absolute top-4 right-4 text-white p-2 rounded-full shadow hover:border"
                            onClick={() => setIsModalOpen(false)}
                        >
                            <FaTimes />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PersonalInfo;
