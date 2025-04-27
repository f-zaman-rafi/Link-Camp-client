import React from 'react';
import { FaBars, FaPeopleArrows } from "react-icons/fa";
import { IoHomeOutline, IoLogOutOutline, IoSettingsOutline, IoHelpOutline, IoLockClosedOutline } from "react-icons/io5";

import useAuth from '../../Hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const DashNav = () => {

    const { logOut } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="w-full md:w-64 bg-blue-400 text-black">
            <ul className="space-y-4 p-4">
                <li className="text-center pb-10 pt-5">
                    <p className="text-4xl font-bold font-caveat">
                        LinkCamp <sub className="text-lg">Dash</sub>
                    </p>
                </li>
                <li className="flex items-center gap-4 p-2 rounded-lg cursor-pointer">
                    <FaBars />
                    <span>Dashboard</span>
                </li>
                <li className="flex items-center gap-4 p-2 rounded-lg cursor-pointer" onClick={() => navigate('reported-post')}>
                    <FaPeopleArrows />
                    <span>Reported Posts</span>
                </li>
                <li className="flex items-center gap-4 p-2 rounded-lg cursor-pointer">
                    <IoSettingsOutline />
                    <span>Settings</span>
                </li>

                <li className="flex items-center gap-4 p-2 rounded-lg cursor-pointer" onClick={() => navigate('/')}>
                    <IoHomeOutline />
                    <span>Get back to Home</span>
                </li>
                <li className="flex items-center gap-4 p-2 rounded-lg cursor-pointer" onClick={logOut}>
                    <IoLogOutOutline />
                    <span>Sign Out</span>
                </li>
            </ul>
        </div>
    );
};

export default DashNav;