import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import useAxiosCommon from "../../Hooks/useAxiosCommon";
import useUserInfo from "../../Hooks/useUserInfo";

const SignIn = () => {
  const { signIn } = useAuth();
  const axiosCommon = useAxiosCommon();
  const navigate = useNavigate();
  const { refetch } = useUserInfo();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    signIn(data.email, data.password)
      .then((result) => {
        const email = result.user.email;
        axiosCommon.post("/login", { email }).then(async () => {
          const { data: user } = await refetch();
          if (user?.verify === "pending") {

            navigate("/pending-request");
          }
          if (user?.verify === "approved" && user?.name === "") {
            navigate("/profile-setup")
          }
          else {
            navigate("/");
          }
        });
      })
      .catch((error) => {
        console.error("Login error:", error.message);
      });
  };

  return (
    <div className="hero min-h-screen">
      <div className="hero-content flex-col lg:flex-row space-x-28 max-w-4xl">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Sign-In!</h1>
          <p className="py-6">
            Log in to your account and access the platform.
          </p>
        </div>

        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
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
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email.message}</p>
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
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-xs">
                  {errors.password.message}
                </p>
              )}

              <div className="flex justify-between">
                <a className="link link-hover">Forgot password?</a>
                <Link to="/sign-up" className="link link-hover mr-4">
                  New here? Create an account
                </Link>
              </div>

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
  );
};

export default SignIn;
