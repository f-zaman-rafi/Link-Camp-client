import React from 'react';
import { FaBars, FaPeopleArrows } from "react-icons/fa"; // Importing icons for admin dashboard and personal info.
import { IoHomeOutline, IoLogOutOutline, IoSettingsOutline, IoHelpOutline, IoLockClosedOutline } from "react-icons/io5"; // Importing icons for home, sign out, settings, help, and privacy (not currently used).
import { useNavigate, useLocation } from 'react-router-dom'; // Hooks for navigation and getting the current location.
import useAuth from '../../../../Hooks/useAuth'; // Custom hook for authentication (logout functionality).
import useUserInfo from '../../../../Hooks/useUserInfo'; // Custom hook to get user information (name, photo, user type).
import Loading from '../../../Loading/Loading'; // Component for displaying a loading state.

const LeftNav = () => {
    const { logOut } = useAuth(); // Function to handle user logout.
    const navigate = useNavigate(); // Function to navigate to different routes.
    const location = useLocation(); // Object containing information about the current URL.
    const { userInfo, isLoading } = useUserInfo(); // Getting user information and loading state.

    if (isLoading) return <Loading />; // Display loading indicator while user info is being fetched.

    const isActive = (path) => location.pathname === path; // Function to check if a given path matches the current URL.

    return (
        <div className="w-full text-black">

            {/* Logo and App Name */}
            <div className="flex gap-2 mx-4 text-center pt-4 mb-10 flex-col items-center">
                <img className='w-16 md:w-12' src="/Logo/linkCampLogo.png" alt="LinkCamp Logo" />
                <p className="text-4xl font-bold text-red-500 md:text-2xl">
                    LinkCamp
                </p>
            </div>

            {/* Navigation Links */}
            <ul className="space-y-4 p-4">
                {/* User Profile Info */}
                <li className="flex items-center gap-2 p-2 cursor-pointer border-b-[0.5px] border-gray-100" >
                    <img src={userInfo?.photo} className="w-10 h-10 rounded-full" alt="User" />
                    <span className='font-semibold'>{userInfo?.name}</span>
                    <span
                        className={`mx-2 text-xs px-1 py-0.5 rounded-full
                                ${userInfo?.userType === "student" ? "bg-green-200" : ""}
                                ${userInfo?.userType === "teacher" ? "bg-blue-200" : ""}
                                ${userInfo?.userType === "admin" ? "bg-red-200" : ""}`}>
                        {userInfo?.userType}
                    </span>
                </li>

                {/* Home Link */}
                <li
                    className={`flex items-center gap-4 p-2 cursor-pointer border-b-[0.5px] border-gray-100 transition-all duration-300 ease-in-out
                        ${isActive('/') ? 'text-xl font-bold text-red-600' : 'text-base'}`}
                    onClick={() => navigate('/')}
                >
                    <IoHomeOutline />
                    <span>Home</span>
                </li>

                {/* Admin Dashboard Link (visible only to admins) */}
                <li
                    className={`flex items-center gap-4 p-2 cursor-pointer border-b-[0.5px] border-gray-100 transition-all duration-300 ease-in-out ${userInfo?.userType !== "admin" ? 'hidden' : 'block'} ${isActive('/admin-dash') ? 'text-xl font-bold text-red-600' : 'text-base'}`}
                    onClick={() => navigate('/admin-dash')}
                >
                    <FaBars />
                    <span>Admin-Dashboard</span>
                </li>

                {/* Personal Info Link */}
                <li
                    className={`flex items-center gap-4 p-2 cursor-pointer border-b-[0.5px] border-gray-100 transition-all duration-300 ease-in-out
                        ${isActive('/personal-info') ? 'text-xl font-bold text-red-600' : 'text-base'}`}
                    onClick={() => navigate('/personal-info')}
                >
                    <FaPeopleArrows />
                    <span>Personal Info</span>
                </li>

                {/* My Posts Link */}
                <li
                    className={`flex items-center gap-4 p-2 cursor-pointer border-b-[0.5px] border-gray-100 transition-all duration-300 ease-in-out ${isActive('/my-posts') ? 'text-xl font-bold text-red-600' : 'text-base'}`}
                    onClick={() => navigate('/my-posts')} >
                    <IoSettingsOutline />
                    <span>My Posts</span>
                </li>

                {/* Sign Out Link */}
                <li
                    className="flex items-center gap-4 p-2 cursor-pointer border-b-[0.5px] border-gray-100"
                    onClick={logOut}
                >
                    <IoLogOutOutline />
                    <span>Sign Out</span>
                </li>
            </ul>
        </div>
    );
};

export default LeftNav;