import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../Pages/SharedComponants/Footer/Footer";
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
        <div className="flex border">
          {/* Left Sidebar */}
          <div className="w-1/3 min-h-screen ">
            <LeftNav type="side-left" />
          </div>

          {/* Center Navbar */}
          <div className="w-1/2 border-x border-gray-200 px-2">
            <CenterNavbar type="center" />
            <div className="">
              <Outlet />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-1/3 min-h-screen">
            <RightNav type="side-right" />
          </div>
        </div>
      )}
      {!hideLayout && <Footer />}
    </>
  );
};

export default Main;
