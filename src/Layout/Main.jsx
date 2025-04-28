import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import CenterNavbar from "../Pages/SharedComponants/Navbar/CenterNav/CenterNavbar";
import LeftNav from "../Pages/SharedComponants/Navbar/LeftNavbar/LeftNav";
import RightNav from "../Pages/SharedComponants/Navbar/RightNavbar/RightNav";

const Main = () => {
  const location = useLocation();
  const noLayoutRoutes = ["/sign-in", "/sign-up"];
  const hideLayout = noLayoutRoutes.includes(location.pathname);

  return (
    <>
      {!hideLayout && (
        <div className="flex h-screen bg-gray-50">
          {/* Left Sidebar - only visible on hover */}
          <div className="w-1/4 lg:block hidden overflow-y-auto ">
            <LeftNav type="side-left" />
          </div>

          {/* Center Section */}
          <div className="lg:w-2/4 w-full flex flex-col lg:mx-8 mx-2">
            {/* Sticky Navbar */}
            <div className="h-16 shrink-0 sticky top-0 z-10">
              <CenterNavbar type="center" />
            </div>

            {/* Scrollable Feed (hidden scrollbar) */}
            <div className="w-full overflow-y-auto custom-scrollbar">
              <Outlet />
            </div>
          </div>

          {/* Right Sidebar - only visible on hover */}
          <div className="w-auto lg:block hidden overflow-y-auto overflow-x-hidden ">
            <RightNav type="side-right" />
          </div>
        </div>
      )}
    </>
  );
};

export default Main;
