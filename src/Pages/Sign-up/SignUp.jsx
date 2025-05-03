import React from "react";
import { useForm } from "react-hook-form"; // Hook for handling form state and validation.
import { Link, useNavigate } from "react-router-dom"; // Components for navigation.
import useAuth from "../../Hooks/useAuth"; // Custom hook for authentication (sign up).
import useAxiosCommon from "../../Hooks/useAxiosCommon"; // Custom hook for making general API requests.
import toast from "react-hot-toast"; // Library for displaying user-friendly notifications.
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SignUp = () => {
  const { signUp } = useAuth(); // Function to sign up a new user.
  const axiosCommon = useAxiosCommon(); // Instance for making API calls.
  const navigate = useNavigate(); // Function to navigate to different routes.
  const [showPassword, setShowPassword] = React.useState(false); // Track password visibility

  // Set up useForm hook
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch, // Function to watch the value of a specific input field.
  } = useForm();

  //  Handle form submission
  const onSubmit = (data) => {
    // Sign up the user with the provided email and password.
    signUp(data.email, data.password)
      .then(() => {
        // Prepare user information to be saved in the database.
        const userInfo = {
          email: data.email,
          user_id: data.Id, // Using 'Id' as the key for both student and teacher IDs.
          userType: data.userType,
          department: data.department,
          session: data.session, // Only applicable to students.
          verify: "pending", // Initial verification status.
          name: "", // Name is initially empty, to be updated in profile setup.
        };

        // Save userInfo to MongoDB via a POST request to the '/users' endpoint.
        axiosCommon.post("/users", userInfo).then(() => {
          // Display a success toast notification.
          toast.success("You're all set! Just hang tight—your account will be approved shortly.");
          // Navigate the user to the pending request page.
          navigate("/pending-request");
        });
      })
      .catch((error) => {
        // Log any sign-up errors.
        console.error("Signup error:", error);

        // Define an object to map Firebase error codes to user-friendly messages.
        const firebaseErrorMessages = {
          'auth/email-already-in-use': "This email is already registered. Try signing in instead.",
          'auth/invalid-email': "The email address you entered is not valid. Please check and try again.",
          'auth/weak-password': "Your password is too weak. Try using at least 6 characters.",
          'auth/operation-not-allowed': "Email/password sign-up is currently disabled. Please contact support.",
          'auth/network-request-failed': "Network error. Please check your connection and try again.",
        };

        // Get the specific error message based on the Firebase error code, or a generic message if the code is not found.
        const errorMessage = firebaseErrorMessages[error.code] || `Sign up failed: ${error.message}`;

        // Show an error toast notification.
        toast.error(errorMessage, {
          autoClose: 2000,
          position: "top-center",
          pauseOnHover: true,
        });

        // Reload the page after a short delay to clear any potential UI issues.
        setTimeout(() => {
          window.location.reload();
        }, 2100);
      });
  };

  // Watch the 'userType' field to conditionally render form fields.
  const selectedUserType = watch("userType");

  return (
    <div className="hero min-h-screen">

      {/* Logo at the top center */}
      <div className="flex justify-center items-center absolute top-[5px]  left-1/2 transform -translate-x-1/2 z-10 space-x-4">
        <img className='w-16 md:w-26' src="/Logo/linkCampLogo.png" alt="LinkCamp Logo" />
      </div>

      <div className="hero-content flex-col w-full md:gap-10 lg:flex-row pt-12">
        {/* Left side with sign-up information */}
        <div className="text-center lg:text-left pt-10">
          <h1 className="lg:text-5xl text-3xl font-bold">Sign-Up!</h1>
          <div className="lg:space-y-2 pt-5">
            <p>Welcome to Link-Camp</p>
            <p>To help verify your account and get you started</p>
            <p>on the platform, please provide your details as per your </p>
            <p>educational documents. We're here to assist you every step of the way!</p>
          </div>
        </div>

        {/* Sign-up form */}
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          {/* React Hook Form Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="card-body">
            <fieldset className="fieldset">
              {/* Email Input */}
              <label className="label" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="input w-full"
                placeholder="Email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Enter a valid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}

              {/* Password Input with Show/Hide Icon Always Visible */}
              <label className="label" htmlFor="password">
                Password
              </label>

              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="input w-full"
                  placeholder="Password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Minimum 6 characters",
                    },
                  })}
                />

                {/* Always visible icon - correctly aligned */}
                <div
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500 z-10"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </div>

              </div>

              {/* User Type Selection */}
              <label className="label" htmlFor="userType">
                User Type
              </label>
              <select
                id="userType"
                className="input w-full"
                {...register("userType", { required: "User type is required" })}
              >
                <option value="" defaultValue>
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
                    className="input w-full"
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
                    className="input w-full"
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
                    className="input w-full"
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
                  <label className="label" htmlFor="teacherId">
                    Teacher ID
                  </label>
                  <input
                    type="text"
                    id="teacherId"
                    className="input w-full"
                    placeholder="Teacher ID"
                    {...register("Id", {
                      required: "Teacher ID is required",
                    })}
                  />
                  {errors.Id && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.Id.message}
                    </p>
                  )}

                  <label className="label" htmlFor="department">
                    Department
                  </label>
                  <select
                    id="department"
                    className="input w-full"
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
                </>
              )}

              {/* Link to Sign In page */}
              <div className="flex justify-between">
                <Link to="/sign-in" className="link link-hover">
                  Already have an account? Sign In
                </Link>
              </div>

              {/* Sign Up Button */}
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