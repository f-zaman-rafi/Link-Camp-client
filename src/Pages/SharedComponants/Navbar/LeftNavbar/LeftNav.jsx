import React from 'react';
import { FaBars, FaPeopleArrows } from "react-icons/fa";
import { IoHomeOutline, IoLogOutOutline, IoSettingsOutline, IoHelpOutline, IoLockClosedOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../../Hooks/useAuth';
import useUserInfo from '../../../../Hooks/useUserInfo';
import Loading from '../../../Loading/Loading';


const LeftNav = () => {

    const { logOut } = useAuth();
    const navigate = useNavigate();
    const { userInfo, isLoading } = useUserInfo();
    if (isLoading) return <Loading />

    return (
        <div className="w-full text-black">
            <ul className="space-y-4 p-4 ">
                <li className="text-center pt-10 pb-20">
                    <p className="text-6xl font-bold font-caveat text-red-600">
                        LinkCamp
                    </p>
                </li>
                <li className="flex items-center gap-4 p-2 cursor-pointer border-b-[0.5px] border-gray-100 ">
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
                <li className="flex items-center gap-4 p-2 cursor-pointer border-b-[0.5px] border-gray-100 ">
                    <FaBars />
                    <span>Admin-Dashboard</span>
                </li>
                <li className="flex items-center gap-4 p-2 cursor-pointer border-b-[0.5px] border-gray-100 ">
                    <FaPeopleArrows />
                    <span>Members Info</span>
                </li>
                <li className="flex items-center gap-4 p-2 cursor-pointer border-b-[0.5px] border-gray-100 ">
                    <IoSettingsOutline />
                    <span>Settings</span>
                </li>
                <li className="flex items-center gap-4 p-2 cursor-pointer border-b-[0.5px] border-gray-100 ">
                    <IoHelpOutline />
                    <span>Help</span>
                </li>
                <li className="flex items-center gap-4 p-2 cursor-pointer border-b-[0.5px] border-gray-100 ">
                    <IoLockClosedOutline />
                    <span>Password</span>
                </li>
                <li className="flex items-center gap-4 p-2 cursor-pointer border-b-[0.5px] border-gray-100 " onClick={() => navigate('/')}>
                    <IoHomeOutline />
                    <span>Get back to Home</span>
                </li>
                <li className="flex items-center gap-4 p-2 cursor-pointer border-b-[0.5px] border-gray-100 " onClick={logOut}>
                    <IoLogOutOutline />
                    <span>Sign Out</span>
                </li>
            </ul>
        </div>
    );
};

export default LeftNav;