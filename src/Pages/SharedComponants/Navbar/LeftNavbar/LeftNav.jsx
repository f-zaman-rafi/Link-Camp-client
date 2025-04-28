import React from 'react';
import { FaBars, FaPeopleArrows } from "react-icons/fa";
import { IoHomeOutline, IoLogOutOutline, IoSettingsOutline, IoHelpOutline, IoLockClosedOutline } from "react-icons/io5";
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../../../Hooks/useAuth';
import useUserInfo from '../../../../Hooks/useUserInfo';
import Loading from '../../../Loading/Loading';

const LeftNav = () => {
    const { logOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { userInfo, isLoading } = useUserInfo();

    if (isLoading) return <Loading />;

    const isActive = (path) => location.pathname === path;

    return (
        <div className="w-full text-black">

            <div className="flex gap-2 mx-4 text-center pt-4 mb-10 flex-col items-center">
                <img className='w-16 md:w-12' src="../../../../../public/Logo/linkCampLogo.png" alt="" />
                <p className="text-4xl font-bold text-red-500 md:text-2xl">
                    LinkCamp
                </p>

            </div>
            <ul className="space-y-4 p-4">
                <li className="flex items-center gap-2 p-2 cursor-pointer border-b-[0.5px] border-gray-100" >
                    <img src={userInfo.photo} className="w-10 h-10 rounded-full" alt="User" />
                    <span className='font-semibold'>{userInfo.name}</span>
                    <span
                        className={`mx-2 text-xs px-1 py-0.5 rounded-full
                            ${userInfo.userType === "student" ? "bg-green-200" : ""}    
                            ${userInfo.userType === "teacher" ? "bg-blue-200" : ""}    
                            ${userInfo.userType === "admin" ? "bg-red-200" : ""}`}>
                        {userInfo.userType}
                    </span>
                </li>
                <li
                    className={`flex items-center gap-4 p-2 cursor-pointer border-b-[0.5px] border-gray-100 transition-all duration-300 ease-in-out 
                    ${isActive('/') ? 'text-xl font-bold text-red-600' : 'text-base'}`}
                    onClick={() => navigate('/')}
                >
                    <IoHomeOutline />
                    <span>Home</span>
                </li>
                <li
                    className={`flex items-center gap-4 p-2 cursor-pointer border-b-[0.5px] border-gray-100 transition-all duration-300 ease-in-out ${userInfo?.userType !== "admin" ? 'hidden' : 'block'} ${isActive('/admin-dash') ? 'text-xl font-bold text-red-600' : 'text-base'}`}
                    onClick={() => navigate('/admin-dash')}
                >
                    <FaBars />
                    <span>Admin-Dashboard</span>
                </li>
                <li
                    className={`flex items-center gap-4 p-2 cursor-pointer border-b-[0.5px] border-gray-100 transition-all duration-300 ease-in-out 
                    ${isActive('/personal-info') ? 'text-xl font-bold text-red-600' : 'text-base'}`}
                    onClick={() => navigate('/personal-info')}
                >
                    <FaPeopleArrows />
                    <span>Personal Info</span>
                </li>
                <li
                    className={`flex items-center gap-4 p-2 cursor-pointer border-b-[0.5px] border-gray-100 transition-all duration-300 ease-in-out ${isActive('/my-posts') ? 'text-xl font-bold text-red-600' : 'text-base'}`}
                    onClick={() => navigate('/my-posts')} >
                    <IoSettingsOutline />
                    <span>My Posts</span>
                </li>

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