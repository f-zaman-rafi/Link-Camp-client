import React from 'react';
import useUserInfo from '../../../Hooks/useUserInfo'; // Custom hook to get user information.
import AddNotice from '../Component/AddNotice/AddNotice'; // Component for adding new notices (admin only).
import NoticeboardFeed from '../Component/NoticeboardFeed/NoticeboardFeed'; // Component to display the feed of notices.

const NoticeboardPage = () => {
    const { userInfo } = useUserInfo(); // Getting user information, including user type.

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