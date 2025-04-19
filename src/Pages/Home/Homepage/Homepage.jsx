import React from "react";
import { Link } from "react-router-dom";

const Homepage = () => {
  return (
    <div>
      <h1>This is home page!</h1>
      <Link to="/sign-in" className="btn">
        Login page
      </Link>
    </div>
  );
};

export default Homepage;
