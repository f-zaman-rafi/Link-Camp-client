import React from 'react';
import UserData from '../ProfileComponents/UserData/UserData';
import UserPosts from '../ProfileComponents/UserPosts/UserPosts';

const ProfileHome = () => {
    return (
        <div className=''>
            <UserData />
            <UserPosts />
        </div>
    );
};

export default ProfileHome;