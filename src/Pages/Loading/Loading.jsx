import React from "react";
import { RingLoader } from "react-spinners"; // Importing the RingLoader component for displaying a loading spinner.

const Loading = () => {
  return (
    // Container for the loading spinner, taking up the full screen and centering its content.
    <div className="max-w-screen min-h-screen flex justify-center items-center">
      {/* Displaying the RingLoader with specified size, color, and speed. */}
      <RingLoader size={60} color="#ff0000" speedMultiplier={1} />
    </div>
  );
};

export default Loading;
