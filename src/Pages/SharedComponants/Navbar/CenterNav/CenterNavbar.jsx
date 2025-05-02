import React, { useEffect, useState } from "react";
import { HiHome, HiSpeakerphone } from "react-icons/hi"; // Importing icons for Home and Announcement.
import { MdAnnouncement } from "react-icons/md"; // Importing the Announcement icon.
import { useLocation, useNavigate } from "react-router-dom"; // Hooks for navigation and getting the current location.
import { GiHamburgerMenu } from "react-icons/gi"; // Hamburger menu icon.
import { IoMdNotifications } from "react-icons/io"; // Notification icon.
import LeftNav from "../LeftNavbar/LeftNav"; // Left sidebar component.
import RightNav from "../RightNavbar/RightNav"; // Right sidebar component.

const CenterNavbar = () => {
  const navigate = useNavigate(); // Function to navigate to different routes.
  const location = useLocation(); // Object containing information about the current URL.
  const [activeTab, setActiveTab] = useState(location.pathname); // State to track the active navigation tab based on the current path.

  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false); // State to control the visibility of the left sidebar.
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false); // State to control the visibility of the right sidebar.

  const handleNavigation = (path) => {
    setActiveTab(path); // Update the active tab state.
    navigate(path); // Navigate to the specified path.
  };

  useEffect(() => {
    setActiveTab(location.pathname); // Update activeTab whenever the location changes.
  }, [location.pathname]);

  return (
    <div className="relative">
      {/* Left Sidebar */}
      <div className={`fixed top-0 left-0 h-full z-50 bg-white shadow-lg transform transition-transform duration-1000 ease-in-out ${isLeftSidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-72`}>
        <LeftNav />
      </div>

      {/* Right Sidebar */}
      <div
        className={`fixed top-0 right-0 z-50 bg-white shadow-lg transform transition-transform duration-1000 ease-in-out
        ${isRightSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
        w-full h-full overflow-y-auto`}
      >
        {/* Close Button - Visible on small devices */}
        <div className="sticky top-0 z-10 bg-white flex justify-end p-4">
          <button
            onClick={() => setIsRightSidebarOpen(false)}
            className="text-2xl font-bold text-gray-700 hover:text-red-500"
          >
            ✕
          </button>
        </div>

        <RightNav />
      </div>


      {/* Overlay */}
      {(isLeftSidebarOpen || isRightSidebarOpen) && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-40"
          onClick={() => {
            setIsLeftSidebarOpen(false);
            setIsRightSidebarOpen(false);
          }}
        ></div>
      )}

      {/* Navbar Wrapper */}
      <div className="flex items-center justify-between mt-2 max-w-2xl mx-auto z-30 relative px-2">

        {/* Left - Burger Menu */}
        <img
          src="/Logo/linkCampLogo.png"
          alt="LinkCamp Logo"
          className="h-10 cursor-pointer lg:hidden"
          onClick={() => setIsLeftSidebarOpen(true)}
        />


        {/* Center - Tabs */}
        <div className="flex justify-center lg:justify-between items-center gap-6 flex-grow">
          <label
            className={`tab lg:flex-1 tooltip tooltip-bottom tooltip-neutral ${activeTab !== "/" ? "hover:bg-gray-200 hover:rounded-full duration-200" : ""}`}
            data-tip="Feed"
          >
            <input
              type="radio"
              name="tabs"
              className="peer hidden"
              checked={activeTab === "/"}
              onChange={() => handleNavigation("/")}
            />
            <HiHome className="lg:text-3xl text-2xl peer-checked:text-red-600 peer-checked:border-b-2 peer-checked:pb-2 duration-200" />
          </label>

          <label
            className={`tab lg:flex-1 tooltip tooltip-bottom tooltip-neutral ${activeTab !== "/announcement" ? "hover:bg-gray-200 hover:rounded-full duration-200" : ""}`}
            data-tip="Announcements"
          >
            <input
              type="radio"
              name="tabs"
              className="peer hidden"
              checked={activeTab === "/announcement"}
              onChange={() => handleNavigation("/announcement")}
            />
            <MdAnnouncement className="lg:text-3xl text-2xl peer-checked:text-red-600 peer-checked:border-b-2 peer-checked:pb-2 duration-200" />
          </label>

          <label
            className={`tab lg:flex-1 tooltip tooltip-bottom tooltip-neutral ${activeTab !== "/noticeboard" ? "hover:bg-gray-200 hover:rounded-full duration-200" : ""}`}
            data-tip="Official Noticeboard"
          >
            <input
              type="radio"
              name="tabs"
              className="peer hidden"
              checked={activeTab === "/noticeboard"}
              onChange={() => handleNavigation("/noticeboard")}
            />
            <HiSpeakerphone className="lg:text-3xl text-2xl peer-checked:text-red-600 peer-checked:border-b-2 peer-checked:pb-2 duration-200" />
          </label>
        </div>

        {/* Right - Notification Icon */}
        <div className="flex items-center">
          <IoMdNotifications
            className="lg:text-3xl text-2xl cursor-pointer lg:hidden"
            onClick={() => setIsRightSidebarOpen(true)}
          />
        </div>
      </div>

    </div>
  );
};

export default CenterNavbar;