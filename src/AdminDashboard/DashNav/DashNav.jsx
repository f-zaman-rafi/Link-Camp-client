import React from 'react';
import { FaBars, FaPeopleArrows } from "react-icons/fa";
import { IoLogOutOutline, IoSettingsOutline, IoHelpOutline, IoLockClosedOutline } from "react-icons/io5";
import useAuth from '../../Hooks/useAuth';

const DashNav = () => {

    const { logOut } = useAuth();

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
                <li className="flex items-center gap-4 p-2 rounded-lg cursor-pointer">
                    <FaPeopleArrows />
                    <span>Members Info</span>
                </li>
                <li className="flex items-center gap-4 p-2 rounded-lg cursor-pointer">
                    <IoSettingsOutline />
                    <span>Settings</span>
                </li>
                <li className="flex items-center gap-4 p-2 rounded-lg cursor-pointer">
                    <IoHelpOutline />
                    <span>Help</span>
                </li>
                <li className="flex items-center gap-4 p-2 rounded-lg cursor-pointer">
                    <IoLockClosedOutline />
                    <span>Password</span>
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