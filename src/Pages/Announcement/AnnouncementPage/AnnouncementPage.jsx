import React from 'react';
import AddAnnouncement from '../Components/AddAnnouncement/AddAnnouncement';
import useUserInfo from '../../../Hooks/useUserInfo';
import AnnouncementFeed from '../Components/AnnouncementFeed/AnnouncementFeed';

const AnnouncementPage = () => {
    const { userInfo } = useUserInfo();

    return (
        <div>
            <div className={`${userInfo.userType !== "teacher" ? "hidden" : ""}`}><AddAnnouncement /></div>
            <div><AnnouncementFeed /></div>
        </div>
    );
};

export default AnnouncementPage;