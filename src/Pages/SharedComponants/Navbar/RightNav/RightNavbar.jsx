import React from "react";
import { IoPersonCircleSharp } from "react-icons/io5";
import useAuth from "../../../../Hooks/useAuth";
import Loading from "../../../Loading/Loading";
import useUserInfo from "../../../../Hooks/useUserInfo";
import { Link } from "react-router-dom";

const RightNavbar = () => {
  const { logOut } = useAuth();
  const { userInfo, isLoading } = useUserInfo();
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex items-center px-5 pt-2">
      <div>

      </div>
      <div className="drawer drawer-end flex justify-end text-4xl">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Page content here */}
          <label htmlFor="my-drawer-4" className="drawer-button">
            <IoPersonCircleSharp />
          </label>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-4" className="drawer-overlay"></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-auto p-4 pr-8 space-y-2">
            {/* Sidebar content here */}
            <li className="text-red-500 border-2 rounded-full my-5 mx-auto text-center cursor-default hover:bg-transparent pointer-events-none">
              <span>{userInfo.userType}</span>
            </li>
            <li>
              <Link to='/user-list'><p>Users</p></Link>
            </li>
            <li>
              <p>Posts</p>
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
