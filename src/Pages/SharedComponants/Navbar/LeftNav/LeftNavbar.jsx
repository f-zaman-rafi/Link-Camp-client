import React from "react";
import { FaUniversity } from "react-icons/fa";
import { Link } from "react-router-dom";

const LeftNavbar = () => {
  return (
    <div className="flex items-center justify-start px-5 pt-2">
      <Link
        to="/"
        className="flex flex-col text-center items-center text-red-600"
      >
        <FaUniversity className="border-2 border-red-600 rounded-full p-[1px] text-2xl" />
        <p className="font-medium">LinkCamp</p>
      </Link>
    </div>
  );
};

export default LeftNavbar;
