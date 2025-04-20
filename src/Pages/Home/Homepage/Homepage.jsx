import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../../../Hooks/useAuth";

const Homepage = () => {
  const { logOut } = useAuth();
  const { userType, department, session, id, verify } = useAuth();

  // fetch("http://localhost:5000/userinfo", {});
  console.log(id);

  return (
    <div>
      <h1>This is home page!</h1>
      <Link to="/sign-in" className="btn">
        Login page
      </Link>
      <Link to="/sign-up" className="btn">
        signup page
      </Link>
      <p onClick={() => logOut()} className="btn">
        signout
      </p>
    </div>
  );
};

export default Homepage;
