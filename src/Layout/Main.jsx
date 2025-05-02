import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import CenterNavbar from "../Pages/SharedComponants/Navbar/CenterNav/CenterNavbar";
import LeftNav from "../Pages/SharedComponants/Navbar/LeftNavbar/LeftNav";
import RightNav from "../Pages/SharedComponants/Navbar/RightNavbar/RightNav";

const Main = () => {
  const location = useLocation(); // Get the current route location.
  const noLayoutRoutes = ["/sign-in", "/sign-up"]; // Array of routes where the main layout should not be applied.
  const hideLayout = noLayoutRoutes.includes(location.pathname); // Check if the current route is in the noLayoutRoutes array.

  return (
    <>
      {/* Conditionally render the layout based on the current route. */}
      {!hideLayout && (
        <div className="flex h-screen bg-gray-50">
          {/* Left Sidebar - only visible on larger screens. */}
          <div className="w-1/4 lg:block hidden overflow-y-auto ">
            <LeftNav type="side-left" /> {/* Component for the left navigation bar. */}
          </div>

          {/* Center Section - contains the main content and center navigation. */}
          <div className="lg:w-2/4 w-full flex flex-col lg:mx-8 mx-2">
            {/* Sticky Navbar at the top of the center section. */}
            <div className="h-16 shrink-0 sticky top-0 z-10">
              <CenterNavbar type="center" /> {/* Component for the center navigation bar. */}
            </div>

            {/* Scrollable Feed area for the main content. */}
            <div className="w-full overflow-y-auto custom-scrollbar">
              <Outlet /> {/* Renders the content of the current child route. */}
            </div>
          </div>

          {/* Right Sidebar - only visible on larger screens. */}
          <div className="w-auto lg:block hidden h-full overflow-y-auto overflow-x-hidden">
            <RightNav type="side-right" /> {/* Component for the right navigation bar. */}
          </div>
        </div>
      )}
    </>
  );
};

export default Main;