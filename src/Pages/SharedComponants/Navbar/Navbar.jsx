import React, { useState } from "react";
import { HiHome } from "react-icons/hi";
import { MdAnnouncement } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { IoPersonCircleSharp } from "react-icons/io5";
import { FaUniversity } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("/");

  const handleNavigation = (path) => {
    setActiveTab(path);
    navigate(path);
  };

  return (
    <div className="flex items-center px-5">
      <div>
        <Link
          to="/"
          className="flex flex-col text-center items-center text-red-600"
          onClick={() => setActiveTab("/")}
        >
          <FaUniversity className="border-2 border-red-600 rounded-full p-[1px] text-2xl" />
          <p className="font-medium">LinkCamp</p>
        </Link>
      </div>

      <div className="tabs flex justify-center w-full">
        <label
          className={`tab flex-1 mx-5 ${
            activeTab !== "/"
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
          className={`tab flex-1 mx-5 ${
            activeTab !== "/noticeboard"
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
          <MdAnnouncement className="text-3xl peer-checked:text-red-600 peer-checked:border-b-2 peer-checked:pb-2 duration-200" />
        </label>

        <label
          className={`tab flex-1 mx-5 ${
            activeTab !== "/add-post"
              ? "hover:bg-gray-200 hover:rounded-full duration-200"
              : ""
          }`}
        >
          <input
            type="radio"
            name="tabs"
            className="peer hidden"
            checked={activeTab === "/add-post"}
            onChange={() => handleNavigation("/add-post")}
          />
          <FaEdit className="text-3xl peer-checked:text-red-600 peer-checked:border-b-2 peer-checked:pb-2 duration-200" />
        </label>
      </div>
      <Link to="/" className="text-4xl">
        <IoPersonCircleSharp />
      </Link>
    </div>
  );
};

export default Navbar;
