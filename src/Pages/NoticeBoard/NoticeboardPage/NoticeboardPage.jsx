import React from "react";
import useUserInfo from "../../../Hooks/useUserInfo"; // Custom hook to get user information.
import AddNotice from "../Component/AddNotice/AddNotice"; // Component for adding new notices (admin only).
import NoticeboardFeed from "../Component/NoticeboardFeed/NoticeboardFeed"; // Component to display the feed of notices.
import Loading from "../../Loading/Loading";

const NoticeboardPage = () => {
  const { userInfo, isLoading } = useUserInfo(); // Getting user information, including user type.

  if (isLoading) return <Loading />;

  return (
    <div>
      {/* Conditionally render the AddNotice component only for admin users. */}
      <div className={`${userInfo?.userType !== "admin" ? "hidden" : ""}`}>
        <AddNotice />
      </div>
      {/* Display the NoticeboardFeed component for all users. */}
      <NoticeboardFeed />
    </div>
  );
};

export default NoticeboardPage;
