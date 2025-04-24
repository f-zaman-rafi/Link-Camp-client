import React, { useState } from "react";
import { HiHome } from "react-icons/hi";
import { MdAnnouncement } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { IoPersonCircleSharp } from "react-icons/io5";
import { FaUniversity } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../../Hooks/useAuth";

const Navbar = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("/");
  const { logOut } = useAuth();
  const handleNavigation = (path) => {
    setActiveTab(path);
    navigate(path);
  };

  return (
    <div className="flex items-center justify-between px-5">
      <div className="pt-2">
        <Link
          to="/"
          className="flex flex-col text-center items-center text-red-600"
          onClick={() => setActiveTab("/")}
        >
          <FaUniversity className="border-2 border-red-600 rounded-full p-[1px] text-2xl" />
          <p className="font-medium">LinkCamp</p>
        </Link>
      </div>

      <div className="tabs flex justify-center border-2">
        <label
          className={`tab flex-1 mx-14 ${activeTab !== "/"
            ? "hover:bg-gray-200 hover:rounded-full duration-200"
            : ""
            }`}
        >
          <input
            type="radio"
            name="tabs"
            className="peer hidden"
            checked={activeTab === "/"}
            onChange={() => handleNavigation("/")}
          />
          <HiHome className="text-3xl peer-checked:text-red-600 peer-checked:border-b-2 peer-checked:pb-2 duration-200" />
        </label>

        <label
          className={`tab flex-1 mx-14 ${activeTab !== "/announcement"
            ? "hover:bg-gray-200 hover:rounded-full duration-200"
            : ""
            }`}
        >
          <input
            type="radio"
            name="tabs"
            className="peer hidden"
            checked={activeTab === "/announcement"}
            onChange={() => handleNavigation("/announcement")}
          />
          <MdAnnouncement className="text-3xl peer-checked:text-red-600 peer-checked:border-b-2 peer-checked:pb-2 duration-200" />
        </label>

        <label
          className={`tab flex-1 mx-14 ${activeTab !== "/noticeboard"
            ? "hover:bg-gray-200 hover:rounded-full duration-200"
            : ""
            }`}
        >
          <input
            type="radio"
            name="tabs"
            className="peer hidden"
            checked={activeTab === "/noticeboard"}
            onChange={() => handleNavigation("/noticeboard")}
          />
          <FaEdit className="text-3xl peer-checked:text-red-600 peer-checked:border-b-2 peer-checked:pb-2 duration-200" />
        </label>
      </div>
      <div className="text-3xl">
        {/* <IoPersonCircleSharp /> */}

        <div className="drawer drawer-end">
          <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            {/* Page content here */}
            <label htmlFor="my-drawer-4" className="drawer-button">
              <IoPersonCircleSharp />
            </label>
          </div>
          <div className="drawer-side">
            <label htmlFor="my-drawer-4" className="drawer-overlay"></label>
            <ul className="menu bg-base-200 text-base-content min-h-full w-auto p-4 pr-8">
              {/* Sidebar content here */}
              <li>
                <a>Sidebar Item 1</a>
              </li>
              <li onClick={logOut}>
                <p>Sign Out</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
