import React from "react";
import { Link } from "react-router-dom";

const Homepage = () => {
  return (
    <div className="min-h-screen">
      <Link to="/sign-in" className="btn">
        Login page
      </Link>
      <Link to="/sign-up" className="btn">
        signup page
      </Link>
    </div>
  );
};

export default Homepage;
