import React from 'react';
import { Outlet } from 'react-router-dom';
import DashNav from '../AdminDashboard/DashNav/DashNav';

const DashLayout = () => {
    return (
        <>
            <div className="flex flex-col overflow-y-auto md:flex-row h-screen overflow-hidden">
                {/* Sidebar navigation for the dashboard. */}
                <div className="md:sticky md:top-0 md:h-screen w-full md:w-64 shrink-0">
                    <DashNav />
                </div>
                {/* Main content area for the dashboard. */}
                <div className="flex-1  p-4">
                    <Outlet /> {/* Component that renders the child route. */}
                </div>
            </div>
        </>
    );
};

export default DashLayout;