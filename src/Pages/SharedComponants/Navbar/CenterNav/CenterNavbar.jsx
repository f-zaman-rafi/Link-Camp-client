import React, { useEffect, useState } from "react";
import { HiHome, HiSpeakerphone } from "react-icons/hi";
import { MdAnnouncement } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";


const CenterNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);
  const handleNavigation = (path) => {
    setActiveTab(path);
    navigate(path);
  };

  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location.pathname]);


  return (
    <div className="tabs flex justify-center mt-2">
      <label
        className={`tab flex-1 ${activeTab !== "/"
          ? "hover:bg-gray-200 hover:rounded-full duration-200"
          : ""
          }`}
      >
        <input
          type="radio"
          name="tabs"
          className="peer hidden"
          checked={activeTab === "/"}
          onChange={() => handleNavigation("/")}
        />
        <HiHome className="text-3xl peer-checked:text-red-600 peer-checked:border-b-2 peer-checked:pb-2 duration-200" />
      </label>

      <label
        className={`tab flex-1 ${activeTab !== "/announcement"
          ? "hover:bg-gray-200 hover:rounded-full duration-200"
          : ""
          }`}
      >
        <input
          type="radio"
          name="tabs"
          className="peer hidden"
          checked={activeTab === "/announcement"}
          onChange={() => handleNavigation("/announcement")}
        />
        <MdAnnouncement className="text-3xl peer-checked:text-red-600 peer-checked:border-b-2 peer-checked:pb-2 duration-200" />
      </label>

      <label
        className={`tab flex-1 ${activeTab !== "/noticeboard"
          ? "hover:bg-gray-200 hover:rounded-full duration-200"
          : ""
          }`}
      >
        <input
          type="radio"
          name="tabs"
          className="peer hidden"
          checked={activeTab === "/noticeboard"}
          onChange={() => handleNavigation("/noticeboard")}
        />
        <HiSpeakerphone
          className="text-3xl peer-checked:text-red-600 peer-checked:border-b-2 peer-checked:pb-2 duration-200" />
      </label>
    </div>
  );
};

export default CenterNavbar;
