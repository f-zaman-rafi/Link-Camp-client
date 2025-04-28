import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import useAxiosCommon from "../../Hooks/useAxiosCommon";
import useUserInfo from "../../Hooks/useUserInfo";
import Swal from "sweetalert2";

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
            navigate("/profile-setup");
          } else {
            navigate('/');
          }
        });
      })
      .catch((error) => {
        if (error.code === 'auth/invalid-credential') {
          Swal.fire({
            icon: 'error',
            title: 'Sign In Failed',
            text: 'You are not registered yet. Please register first.',
            confirmButtonText: 'Go to Sign Up',
          }).then(() => {
            navigate('/sign-up');
            window.location.reload();
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Sign In Failed',
            text: error.message,
            confirmButtonText: 'Go back to Sign In',

          }).then(() => {
            navigate('/sign-in');
            window.location.reload();
          });
        }
      });
  };

  return (
    <div>
      <>
        <marquee
          behavior="scroll"
          direction="left"
          className="text-xl font-bold text-center py-4"
          onMouseEnter={(e) => e.target.stop()}
          onMouseLeave={(e) => e.target.start()}
          scrollamount="10"
          loop="infinite"
        >
          Welcome to LinkCamp! For testing purposes, you can sign up or also use these credentials:
          ----------
          Admin: admin@admin.admin / admin.admin.admin
          ----------
          Student: student@student.student / student@student.student
          ----------
          Teacher: teacher@teacher.teacher / teacher@teacher.teacher
          ----------
          You can <a href="/sign-up" className="text-blue-500">sign up</a> here anytime!
        </marquee>


      </>

      <div className="hero min-h-screen">

        <div className="flex justify-center items-center absolute top-[5px] lg:top-[100px]  left-1/2 transform -translate-x-1/2 z-10 space-x-4">
          <img className='w-16 md:w-26' src="../../../public/Logo/linkCampLogo.png" alt="" />
        </div>

        <div className="hero-content flex-col lg:flex-row lg:space-x-28 lg:max-w-4xl">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold">Welcome to LinkCamp!</h1>
            <p className="py-6 w-auto">
              Log in to your LinkCamp account to stay updated on campus news, class announcements, official notices, and engage in discussions. Share ideas, report issues, and connect with your peers.
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
    </div >
  );
};

export default SignIn;
