import React from "react";
import AddAnnouncement from "../Components/AddAnnouncement/AddAnnouncement";
import useUserInfo from "../../../Hooks/useUserInfo";
import AnnouncementFeed from "../Components/AnnouncementFeed/AnnouncementFeed";
import Loading from "../../Loading/Loading";

const AnnouncementPage = () => {
  const { userInfo, isLoading } = useUserInfo(); // Custom hook to fetch and provide user information.

  if (isLoading) return <Loading />;

  return (
    <div>
      {/* Conditionally render the AddAnnouncement component only for users with the 'teacher' role. */}
      <div className={`${userInfo?.userType !== "teacher" ? "hidden" : ""}`}>
        <AddAnnouncement /> {/* Component for adding new announcements. */}
      </div>
      {/* Component to display the feed of announcements. */}
      <div>
        <AnnouncementFeed />
      </div>
    </div>
  );
};

export default AnnouncementPage;
