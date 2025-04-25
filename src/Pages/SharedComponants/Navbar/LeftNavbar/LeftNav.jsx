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
            <ul className="space-y-4 p-4">
                <li className="text-center pt-10 pb-20">
                    <p className="text-6xl font-bold font-caveat text-red-600">
                        LinkCamp
                    </p>
                </li>
                <li className="flex items-center gap-4 p-2 cursor-pointer border-b-[0.5px] border-gray-100" >
                    <img src={userInfo.photo} className="w-10 h-10 rounded-full" alt="User" />
                    <span className='text-2xl'>{userInfo.name}</span>
                    <span
                        className={`mx-2 text-xs px-2 py-0.5 rounded-full
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
                    className={`flex items-center gap-4 p-2 cursor-pointer border-b-[0.5px] border-gray-100 ${isActive('/help') ? 'bg-gray-200 font-bold' : ''}`}
                >
                    <IoHelpOutline />
                    <span>Help</span>
                </li>
                <li
                    className={`flex items-center gap-4 p-2 cursor-pointer border-b-[0.5px] border-gray-100 ${isActive('/password') ? 'bg-gray-200 font-bold' : ''}`}
                >
                    <IoLockClosedOutline />
                    <span>Password</span>
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