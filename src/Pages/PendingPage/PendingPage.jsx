import React from "react";
import { ClockLoader } from "react-spinners";

const PendingPage = () => {
    return (
        <div className=" flex flex-col items-center justify-center min-h-screen">
            <div className="bg-white p-6 rounded-lg shadow-2xl shadow-red-500 text-center flex flex-col items-center gap-10 m-5">
                <ClockLoader speedMultiplier={.5} color="#ff0000" size={50} className="text-yellow-500 text-6xl mb-4" />
                <h1 className="text-2xl font-bold mb-2">Registration Pending</h1>
                <p className="text-gray-600">
                    You have registered successfully. Please wait for the authority's approval. We will notify you once your account is verified.
                </p>
            </div>
        </div>
    );
};

export default PendingPage;