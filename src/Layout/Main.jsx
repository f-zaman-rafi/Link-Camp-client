import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../Pages/SharedComponants/Footer/Footer";
import CenterNavbar from "../Pages/SharedComponants/Navbar/CenterNav/CenterNavbar";
import LeftNavbar from "../Pages/SharedComponants/Navbar/LeftNav/LeftNavbar";
import RightNavbar from "../Pages/SharedComponants/Navbar/RightNav/RightNavbar";

const Main = () => {
  const location = useLocation();
  const noLayoutRoutes = ["/sign-in", "/sign-up"];
  const hideLayout = noLayoutRoutes.includes(location.pathname);

  return (
    <>
      {!hideLayout && (
        <div className="flex">
          {/* Left Sidebar */}
          <div className="w-1/3 min-h-screen">
            <LeftNavbar type="side-left" />
          </div>

          {/* Center Navbar */}
          <div className="w-full lg:w-1/2 border-x border-gray-200">
            <CenterNavbar type="center" />
            <div className="">
              <Outlet />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-1/4 min-h-screen">
            <RightNavbar type="side-right" />
          </div>
        </div>
      )}
      {!hideLayout && <Footer />}
    </>
  );
};

export default Main;
