import React from "react";
import AddPost from "../Componants/AddPost/AddPost"; // Importing the component for adding new posts.
import Feed from "../Componants/Feed/Feed"; // Importing the component that displays the post feed.

const Homepage = () => {
  return (
    // Main container for the homepage.
    <div className="">
      {/* Component allowing users to create and submit new posts. */}
      <AddPost />
      {/* Component displaying the feed of existing posts. */}
      <Feed />
    </div>
  );
};

export default Homepage;
