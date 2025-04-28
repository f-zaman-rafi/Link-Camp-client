import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import useAxiosCommon from "../../Hooks/useAxiosCommon";
import toast from "react-hot-toast";

const SignUp = () => {
  const { signUp } = useAuth();
  const axiosCommon = useAxiosCommon();
  const navigate = useNavigate();

  // Set up useForm hook
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  //  Handle form submission

  const onSubmit = (data) => {
    signUp(data.email, data.password)
      .then(() => {
        const userInfo = {
          email: data.email,
          user_id: data.Id,
          userType: data.userType,
          department: data.department,
          session: data.session,
          verify: "pending",
          name: "",
        };

        // save userInfo to Mongodb
        axiosCommon.post("/users", userInfo).then(() => {
          toast.success("You're all set! Just hang tight—your account will be approved shortly.");
          navigate("/pending-request");
        });
      })
      .catch((error) => {
        console.error("Signup error:", error.message);
      });
  };

  const selectedUserType = watch("userType");

  return (
    <div className="hero min-h-screen">

      <div className="flex justify-center items-center absolute top-[5px]  left-1/2 transform -translate-x-1/2 z-10 space-x-4">
        <img className='w-16 md:w-26' src="/Logo/linkCampLogo.png" alt="" />
      </div>

      <div className="hero-content flex-col w-full md:gap-10 lg:flex-row pt-12">
        <div className="text-center lg:text-left pt-10">
          <h1 className="lg:text-5xl text-3xl font-bold">Sign-Up!</h1>
          <div className="lg:space-y-2 pt-5">
            <p>Welcome to Link-Camp</p>
            <p>To help verify your account and get you started</p>
            <p>on the platform, please provide your details as per your </p>
            <p>educational documents. We're here to assist you every step of the way!</p>
          </div>
        </div>

        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          {/* React Hook Form Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="card-body">
            <fieldset className="fieldset">
              {/* Email */}
              <label className="label" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="input"
                placeholder="Email"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}

              {/* Password */}
              <label className="label" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="input"
                placeholder="Password"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}

              {/* User Type Selection */}
              <label className="label" htmlFor="userType">
                User Type
              </label>
              <select
                id="userType"
                className="input"
                {...register("userType", { required: "User type is required" })}
              >
                <option value="" defaultChecked>
                  Please Select Your User Type
                </option>
                <option value="admin" disabled>
                  Admin
                </option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
              </select>
              {errors.userType && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.userType.message}
                </p>
              )}

              {/* Conditional Fields for Student */}
              {/* Conditional Fields for Student */}
              {selectedUserType === "student" && (
                <>
                  <label className="label" htmlFor="Student ID">
                    Student ID
                  </label>
                  <input
                    type="text"
                    id="Student ID"
                    className="input"
                    placeholder="Student ID"
                    {...register("Id", {
                      required: "Student ID is required",
                    })}
                  />
                  {errors.Id && (
                    <p className="text-red-500 text-xs mt-1">{errors.Id.message}</p>
                  )}

                  <label className="label" htmlFor="department">
                    Department
                  </label>
                  <select
                    id="department"
                    className="input"
                    {...register("department", {
                      required: "Department is required",
                    })}
                  >
                    <option value="">Select Department</option>
                    {[
                      "Computer Science",
                      "Electrical Engineering",
                      "Mechanical Engineering",
                      "Civil Engineering",
                      "Business Administration",
                      "Economics",
                      "Accounting & Finance",
                      "English",
                      "Law",
                      "Pharmacy",
                      "Public Health",
                      "Architecture",
                      "Mathematics",
                      "Physics",
                      "Chemistry",
                      "Biology",
                      "Environmental Science",
                      "Sociology",
                      "Political Science",
                      "Psychology",
                    ].map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  {errors.department && (
                    <p className="text-red-500 text-xs mt-1">{errors.department.message}</p>
                  )}

                  <label className="label" htmlFor="session">
                    Session
                  </label>
                  <select
                    id="session"
                    className="input"
                    {...register("session", {
                      required: "Session is required",
                    })}
                  >
                    <option value="">Select Session</option>
                    {Array.from({ length: 24 }, (_, i) => {
                      const startYear = 2002 + i;
                      const endYear = startYear + 1;
                      return (
                        <option key={startYear} value={`${startYear}-${endYear}`}>
                          {startYear}-{endYear}
                        </option>
                      );
                    })}
                  </select>
                  {errors.session && (
                    <p className="text-red-500 text-xs mt-1">{errors.session.message}</p>
                  )}
                </>
              )}

              {/* Conditional Fields for Teacher */}
              {selectedUserType === "teacher" && (
                <>
                  <label className="label" htmlFor="userID">
                    Teacher ID
                  </label>
                  <input
                    type="text"
                    id="teacher ID"
                    className="input"
                    placeholder="Teacher ID"
                    {...register("Id", {
                      required: "Teacher ID is required",
                    })}
                  />
                  {errors.teacherId && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.teacherId.message}
                    </p>
                  )}

                  <label className="label" htmlFor="department">
                    Department
                  </label>
                  <select
                    id="department"
                    className="input"
                    {...register("department", {
                      required: "Department is required",
                    })}
                  >
                    <option value="">Select Department</option>
                    {[
                      "Computer Science",
                      "Electrical Engineering",
                      "Mechanical Engineering",
                      "Civil Engineering",
                      "Business Administration",
                      "Economics",
                      "Accounting & Finance",
                      "English",
                      "Law",
                      "Pharmacy",
                      "Public Health",
                      "Architecture",
                      "Mathematics",
                      "Physics",
                      "Chemistry",
                      "Biology",
                      "Environmental Science",
                      "Sociology",
                      "Political Science",
                      "Psychology",
                    ].map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  {errors.department && (
                    <p className="text-red-500 text-xs mt-1">{errors.department.message}</p>
                  )}
                  {errors.department && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.department.message}
                    </p>
                  )}
                </>
              )}

              <div className="flex justify-between">
                <Link to="/sign-in" className="link link-hover">
                  Already have an account? Sign In
                </Link>
              </div>

              <input
                className="btn btn-neutral mt-4"
                type="submit"
                value="Sign Up"
              />
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
