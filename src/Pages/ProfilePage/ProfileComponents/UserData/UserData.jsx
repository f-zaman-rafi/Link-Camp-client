import React, { useState } from 'react';
import { FaEdit, FaTimes } from 'react-icons/fa';
import useUserInfo from '../../../../Hooks/useUserInfo';
import Loading from '../../../Loading/Loading';


const UserData = () => {
    const { userInfo, isLoading } = useUserInfo();
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (isLoading) return <Loading />;

    return (
        <div className="bg-gray-100 min-h-screen p-4 rounded-lg">
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
                    {/* Edit Icon for Photo */}
                    <button className="absolute bottom-2 right-2 bg-blue-500 text-white p-2 rounded-full shadow hover:bg-blue-600">
                        <FaEdit />
                    </button>
                </div>
            </div>

            {/* User Info */}
            <div className="mt-16 bg-white shadow-md rounded-lg p-6 relative">
                {/* Edit Button for Info Section */}
                <button className="absolute top-4 right-4 bg-blue-500 text-white p-2 rounded-full shadow hover:bg-blue-600">
                    <FaEdit />
                </button>

                <h1 className="text-2xl font-bold text-gray-800">{userInfo.name}</h1>
                <p className="text-gray-600">{userInfo.email}</p>
                <p className="text-gray-600 capitalize">{userInfo.userType}</p>

                {/* Additional Details */}
                <div className="mt-4">
                    <h2 className="text-lg font-semibold text-gray-800">Details</h2>
                    <ul className="mt-2 space-y-2">
                        <li>
                            <span className="font-medium text-gray-700">Verify: </span>{" "}
                            {userInfo.verify}
                        </li>
                        <li>
                            <span className="font-medium text-gray-700">Department:</span>{" "}
                            {userInfo.department}
                        </li>
                        <li>
                            <span className="font-medium text-gray-700">User ID:</span>{" "}
                            {userInfo.user_id}
                        </li>
                    </ul>
                </div>
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
                            className="absolute top-2 right-2 text-white p-2 rounded-full shadow hover:border"
                            onClick={() => setIsModalOpen(false)} // Close modal on click
                        >
                            <FaTimes />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserData;