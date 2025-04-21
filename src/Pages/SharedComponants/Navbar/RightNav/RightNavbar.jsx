import React from "react";
import { IoPersonCircleSharp } from "react-icons/io5";
import useAuth from "../../../../Hooks/useAuth";

const RightNavbar = () => {
  const { logOut } = useAuth();

  return (
    <div className="text-4xl px-5 pt-2">
      <div className="drawer drawer-end flex justify-end">
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
  );
};

export default RightNavbar;
