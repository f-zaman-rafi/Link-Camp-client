import React from "react";
import { HiHome } from "react-icons/hi";
import { MdAnnouncement } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { IoPersonCircleSharp } from "react-icons/io5";
import { FaUniversity } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="flex items-center px-5">
      <div>
        <Link
          to="/"
          className="flex flex-col text-center items-center text-red-600"
        >
          <FaUniversity className="border-2 border-red-600 rounded-full p-[1px] text-2xl" />
          <p className="font-medium">LinkCamp</p>
        </Link>
      </div>

      {/* name of each tab group should be unique */}

      <div className="tabs flex justify-center w-full py-5">
        <label className="tab flex-1">
          <input
            type="radio"
            name="tabs"
            defaultChecked
            className="peer hidden"
          />
          <HiHome className="text-4xl peer-checked:text-red-600" />
        </label>

        <label className="tab flex-1">
          <input type="radio" name="tabs" className="peer hidden" />
          <MdAnnouncement className="text-4xl peer-checked:text-red-600" />
        </label>
        <label className="tab flex-1">
          <input type="radio" name="tabs" className="peer hidden" />
          <FaEdit className="text-4xl peer-checked:text-red-600" />
        </label>
      </div>
      <Link to="/" className="text-4xl">
        <IoPersonCircleSharp />
      </Link>
    </div>
  );
};

export default Navbar;
