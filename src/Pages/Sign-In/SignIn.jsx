import React from "react";
import { useForm } from "react-hook-form"; // Hook for handling form state and validation.
import { Link, useNavigate } from "react-router-dom"; // Components for navigation.
import useAuth from "../../Hooks/useAuth"; // Custom hook for authentication (sign in).
import useAxiosCommon from "../../Hooks/useAxiosCommon"; // Custom hook for making general API requests.
import useUserInfo from "../../Hooks/useUserInfo"; // Custom hook to get and refetch user information.
import toast from "react-hot-toast"; // Library for displaying user-friendly notifications.
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Loading from "../Loading/Loading";

const SignIn = () => {
  const { signIn } = useAuth(); // Function to sign in the user.
  const axiosCommon = useAxiosCommon(); // Instance for making API calls.
  const navigate = useNavigate(); // Function to navigate to different routes.
  const { isLoading, refetch } = useUserInfo(); // Function to refetch user information.
  const [showPassword, setShowPassword] = React.useState(false); // Track password visibility

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm(); // Form handling utilities.

  const onSubmit = (data) => {
    // Sign in the user with the provided email and password.
    signIn(data.email, data.password)
      .then((result) => {
        const email = result.user.email;
        // Send the user's email to the server for session management.
        axiosCommon.post("/login", { email }).then(async () => {
          // Refetch user information to get the latest data.
          const { data: user } = await refetch();
          // Redirect the user based on their verification status and profile completion.
          setTimeout(() => {
            if (user?.verify === "pending") {
              navigate("/pending-request");
            } else if (user?.verify === "approved" && user?.name === "") {
              navigate("/profile-setup");
            } else {
              navigate("/");
            }
          }, 20);
        });
      })
      .catch((error) => {
        // Log any sign-in errors.
        console.error("Error Code:", error.code);
        console.error("Error Message:", error.message);

        let errorMessage = "Something went wrong. Please try again.";

        // Customize the error message for invalid credentials.
        if (error.code === "auth/invalid-credential") {
          errorMessage =
            "We couldn't sign you in. Please double-check your email and password.";
        }

        // Display an error toast notification.
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

  if (isLoading) return <Loading />;

  return (
    <div>
      <>
        {/* Marquee for displaying informational messages. */}
        <marquee
          behavior="scroll"
          direction="left"
          className="text-xl font-bold text-center py-4"
          onMouseEnter={(e) => e.target.stop()}
          onMouseLeave={(e) => e.target.start()}
          scrollamount="10"
          loop="infinite"
        >
          Welcome to LinkCamp — Use the credentials below for instant test
          access, or sign up to create your own account.
        </marquee>
      </>

      <div className="hero min-h-screen">
        {/* Logo at the top center */}
        <div className="flex justify-center items-center absolute top-[5px]  left-1/2 transform -translate-x-1/2 z-10 space-x-4">
          <img
            className="w-16 md:w-26"
            src="/Logo/linkCampLogo.png"
            alt="LinkCamp Logo"
          />
        </div>

        <div className="hero-content flex-col lg:flex-row lg:space-x-28 lg:max-w-4xl pt-12">
          {/* Left side with welcome text */}
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold">Welcome to LinkCamp!</h1>
            <p className="py-6 w-auto">
              Log in to your LinkCamp account to stay updated on campus news,
              class announcements, official notices, and engage in discussions.
              Share ideas, report issues, and connect with your peers.
            </p>
          </div>

          {/* Sign-in form */}
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <form onSubmit={handleSubmit(onSubmit)} className="card-body">
              <fieldset className="fieldset">
                {/* Email Input */}
                <label className="label" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="input w-full pr-12"
                  placeholder="Email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value:
                        /^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Enter a valid email address",
                    },
                  })}
                />

                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email.message}</p>
                )}

                {/* Password Input with Show/Hide Icon Always Visible */}
                <label className="label" htmlFor="password">
                  Password
                </label>

                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="input w-full pr-12"
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
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <FaEyeSlash size={18} />
                    ) : (
                      <FaEye size={18} />
                    )}
                  </div>
                </div>

                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}

                {/* Forgot Password and Sign Up Links */}
                <div className="flex justify-between">
                  <a className="link link-hover">Forgot password?</a>
                  <Link to="/sign-up" className="link link-hover mr-4">
                    New here? Create an account
                  </Link>
                </div>

                {/* Testing shortcuts */}
                <div className="text-center mt-4 space-y-2 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500 font-semibold">
                      Quick access for testing:
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <button
                      type="button"
                      className="text-blue-600 hover:underline"
                      onClick={() => {
                        setValue("email", "admin@admin.admin");
                        setValue("password", "admin.admin.admin");
                      }}
                    >
                      🔑 Admin Credentials
                    </button>
                    <button
                      type="button"
                      className="text-blue-600 hover:underline"
                      onClick={() => {
                        setValue("email", "teacher@teacher.teacher");
                        setValue("password", "teacher@teacher.teacher");
                      }}
                    >
                      👨‍🏫 Teacher Credentials
                    </button>
                    <button
                      type="button"
                      className="text-blue-600 hover:underline"
                      onClick={() => {
                        setValue("email", "student@student.student");
                        setValue("password", "student@student.student");
                      }}
                    >
                      🎓 Student Credentials
                    </button>
                  </div>
                </div>

                {/* Login Button */}
                <input
                  className="btn btn-neutral mt-4"
                  type="submit"
                  value="Login"
                />
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
