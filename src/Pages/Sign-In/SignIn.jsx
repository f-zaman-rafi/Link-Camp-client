import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import useAxiosCommon from "../../Hooks/useAxiosCommon";
import useUserInfo from "../../Hooks/useUserInfo";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

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
          } else if (user?.verify === "approved" && user?.name === "") {
            navigate("/profile-setup");
          } else {
            navigate('/');
          }
        });
      })
      .catch((error) => {
        console.error("Error Code:", error.code);
        console.error("Error Message:", error.message);

        let errorMessage = "Something went wrong. Please try again.";

        if (error.code === 'auth/invalid-credential') {
          errorMessage = "We couldn't sign you in. Please double-check your email and password.";
        }

        toast.error(errorMessage, {
          autoClose: 2000,
          position: "top-center",
          pauseOnHover: true,
        });

        setTimeout(() => {
          window.location.reload();
        }, 2100);
      })
  }

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
          Welcome to LinkCamp! Admin Access: admin@admin.admin / admin.admin.admin —
          Sign up anytime or test directly! Student: student@student.student / student@student.student —
          Teacher: teacher@teacher.teacher / teacher@teacher.teacher
        </marquee>


      </>

      <div className="hero min-h-screen">

        <div className="flex justify-center items-center absolute top-[5px]  left-1/2 transform -translate-x-1/2 z-10 space-x-4">
          <img className='w-16 md:w-26' src="/Logo/linkCampLogo.png" alt="" />
        </div>

        <div className="hero-content flex-col lg:flex-row lg:space-x-28 lg:max-w-4xl pt-12">
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
                      value: /^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Enter a valid email address",
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
