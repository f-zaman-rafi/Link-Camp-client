import React from 'react';
import useUserInfo from '../../../Hooks/useUserInfo';
import AddNotice from '../Component/AddNotice/AddNotice';
import NoticeboardFeed from '../Component/NoticeboardFeed/NoticeboardFeed';

const NoticeboardPage = () => {
    const { userInfo } = useUserInfo();

    return (
        <div>
            <div className={`${userInfo.userType !== "admin" ? "hidden" : ""}`}><AddNotice /></div>
            <NoticeboardFeed />
        </div>
    );
};

export default NoticeboardPage;