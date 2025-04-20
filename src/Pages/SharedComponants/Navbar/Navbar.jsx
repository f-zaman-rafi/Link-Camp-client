import React from "react";
import { HiHome } from "react-icons/hi";
import { MdAnnouncement } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { IoPersonCircleSharp } from "react-icons/io5";
import { FaUniversity } from "react-icons/fa";

const Navbar = () => {
  return (
    <div className="">
      <div>
        <FaUniversity />
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
        <div className="tab-content text-center py-10">Tab content 1</div>
        <label className="tab flex-1">
          <input type="radio" name="tabs" className="peer hidden" />
          <MdAnnouncement className="text-4xl peer-checked:text-red-600" />
        </label>
        <div className="tab-content text-center py-10">Tab content 2</div>
        <label className="tab flex-1">
          <input type="radio" name="tabs" className="peer hidden" />
          <FaEdit className="text-4xl peer-checked:text-red-600" />
        </label>
        <div className="tab-content text-center py-10">Tab content 3</div>
      </div>
      <div>
        <IoPersonCircleSharp />
      </div>
    </div>
  );
};

export default Navbar;
