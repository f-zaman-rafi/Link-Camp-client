import React from 'react';
import { Outlet } from 'react-router-dom';
import DashNav from '../AdminDashboard/DashNav/DashNav';

const DashLayout = () => {
    return (
        <>
            <div className='flex flex-col md:flex-row'>
                <DashNav />
                <Outlet />
            </div>
        </>
    );
};

export default DashLayout;