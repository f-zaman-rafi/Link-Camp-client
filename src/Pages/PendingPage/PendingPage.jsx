import React from "react";
import { ClockLoader } from "react-spinners"; // Importing the ClockLoader component for a loading animation.

const PendingPage = () => {
    return (
        // Main container for the pending page, centering its content vertically and horizontally.
        <div className=" flex flex-col items-center justify-center min-h-screen">
            {/* Container for the pending message box with styling. */}
            <div className="bg-white p-6 rounded-lg shadow-2xl shadow-red-500 text-center flex flex-col items-center gap-10 m-5">
                {/* Displaying the ClockLoader animation. */}
                <ClockLoader speedMultiplier={.5} color="#ff0000" size={50} className="text-yellow-500 text-6xl mb-4" />
                {/* Heading indicating registration is pending. */}
                <h1 className="text-2xl font-bold mb-2">Registration Pending</h1>
                {/* Paragraph explaining the pending status and the expected timeframe for approval. */}
                <p className="text-gray-600">
                    You have successfully registered. Please allow up to 2 working hours for the authority's approval. Your account will be activated once verified.
                </p>
            </div>
        </div>
    );
};

export default PendingPage;