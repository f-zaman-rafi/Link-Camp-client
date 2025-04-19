import React from "react";

const SignIn = () => {
  return (
    <div className="hero min-h-screen">
      <div className="hero-content flex-col lg:flex-row space-x-28 max-w-4xl">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Sign-In!</h1>
          <p className="py-6">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
            excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
            a id nisi.
          </p>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <form className="card-body">
            <fieldset className="fieldset">
              <label className="label">Email</label>
              <input type="email" className="input" placeholder="Email" />
              <label className="label">Password</label>
              <input type="password" className="input" placeholder="Password" />
              <div className="flex justify-between px-4">
                <a className="link link-hover">Forgot password?</a>
                <a className="link link-hover">New here? Create an account</a>
              </div>
              <input
                className="btn btn-neutral mt-4"
                type="submit"
                value="login"
              />
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
