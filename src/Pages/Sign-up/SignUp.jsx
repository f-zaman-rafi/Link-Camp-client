import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [userType, setUserType] = useState("");

  // Set up useForm hook
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  // Handle form submission
  const onSubmit = (data) => {
    console.log(data); // Send data to backend or authentication logic
  };

  // Watch user type to conditionally render fields
  const selectedUserType = watch("userType");

  return (
    <div className="hero min-h-screen">
      <div className="hero-content flex-col w-full gap-32 lg:flex-row">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Sign-Up!</h1>
          <p className="py-6">Create an account to access the platform.</p>
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
                // defaultValue={userType}
                // onChange={(e) => setUserType(e.target.value)}
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
              {selectedUserType === "student" && (
                <>
                  <label className="label" htmlFor="studentId">
                    Student ID
                  </label>
                  <input
                    type="text"
                    id="studentId"
                    className="input"
                    placeholder="Student ID"
                    {...register("studentId", {
                      required: "Student ID is required",
                    })}
                  />
                  {errors.studentId && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.studentId.message}
                    </p>
                  )}

                  <label className="label" htmlFor="department">
                    Department
                  </label>
                  <input
                    type="text"
                    id="department"
                    className="input"
                    placeholder="Department"
                    {...register("department", {
                      required: "Department is required",
                    })}
                  />
                  {errors.department && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.department.message}
                    </p>
                  )}

                  <label className="label" htmlFor="session">
                    Session
                  </label>
                  <input
                    type="text"
                    id="session"
                    className="input"
                    placeholder="Session"
                    {...register("session", {
                      required: "Session is required",
                    })}
                  />
                  {errors.session && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.session.message}
                    </p>
                  )}
                </>
              )}

              {/* Conditional Fields for Teacher */}
              {selectedUserType === "teacher" && (
                <>
                  <label className="label" htmlFor="teacherId">
                    Teacher ID
                  </label>
                  <input
                    type="text"
                    id="teacherId"
                    className="input"
                    placeholder="Teacher ID"
                    {...register("teacherId", {
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
                  <input
                    type="text"
                    id="department"
                    className="input"
                    placeholder="Department"
                    {...register("department", {
                      required: "Department is required",
                    })}
                  />
                  {errors.department && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.department.message}
                    </p>
                  )}
                </>
              )}

              <div className="flex justify-between px-4">
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
