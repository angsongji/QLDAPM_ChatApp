import { use, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlayCircle, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { GrFormNextLink } from "react-icons/gr";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

const validateForm = (formData) => {
  if (!formData.email.trim()) return toast.error("Email is required");

  if (!formData.password.trim()) return toast.error("Password is required");

  return 0; //Not show any toast = 0 = not have error
};

const FormLogIn = ({ isLoading, setIsLoading }) => {
  const { register, handleSubmit } = useForm();
  const logIn = useAuthStore((state) => state.logIn);
  const [showPass, setShowPass] = useState(false);

  const onSubmit = async (data) => {
    if (validateForm(data) != 0) return;
    try {
      setIsLoading(true);
      await logIn(data);
    } catch (error) {
      // console.error("Sign in error", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className=" w-full  flex flex-col justify-center gap-10 items-center"
    >
      <label className="input ">
        <svg
          className="h-[1em] opacity-50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <rect width="20" height="16" x="2" y="4" rx="2"></rect>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
          </g>
        </svg>
        <input
          {...register("email")}
          name="email"
          type="email"
          placeholder="mail@site.com"
          disabled={isLoading}
          autoComplete="current-email"
        />
      </label>
      {/* Input sẽ chiếm phần còn lại */}
      <label className="input ">
        <svg
          className="h-[1em] opacity-50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
            <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
          </g>
        </svg>
        <input
          {...register("password")}
          name="password"
          placeholder="password"
          type={showPass ? "text" : "password"}
          disabled={isLoading}
          autoComplete="current-password"
        />
        <button
          type="button"
          className=" text-xl flex items-center cursor-pointer text-gray-400"
          onClick={() => setShowPass((prev) => !prev)}
        >
          {showPass ? <FaRegEyeSlash /> : <FaRegEye />}
        </button>
      </label>

      <div className="flex items-center justify-center">
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-neutral btn-outline rounded-xl text-lg hover:bg-blue-900 hover:border-0"
        >
          {isLoading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            <GrFormNextLink />
          )}
        </button>
      </div>
    </form>
  );
};

const SignInPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-200">
      <div className="absolute flex gap-2 left-1/2 -translate-x-1/2 top-[5vw] md:top-[3vw] md:translate-x-0  md:left-[3vw]  items-center text-blue-900">
        <FaPlayCircle className=" text-2xl sm:text-3xl md:text-4xl " />
        <div className="text-3xl font-bold ">FunTogether</div>
      </div>
      <div className="w-fit absolute flex gap-2 bottom-5 right-5 items-center">
        <div className="flex w-[50vw] md:w-[35vw] flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="skeleton h-15 w-2/3"></div>
            <div className="skeleton h-5 w-28"></div>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <div className="skeleton h-5 w-3/5 "></div>
            <div className="skeleton h-5 w-2/5 "></div>
          </div>
        </div>
      </div>
      <div className="w-full max-w-[90vw] md:min-w-[400px] md:max-w-[400px] bg-blue-100/80 rounded-lg shadow-lg px-5 md:px-10 relative">
        <div className="flex flex-col items-center mt-10 mb-15 text-blue-900">
          <div className="text-2xl font-bold">SIGN IN</div>
        </div>
        <FormLogIn isLoading={isLoading} setIsLoading={setIsLoading} />

        <div className=" text-center text-sm mt-10 mb-5">
          <p className="text-gray-400">
            Don't have an account?{" "}
            <button
              type="button"
              disabled={isLoading}
              onClick={() => navigate("/stranger/sign-up")}
              className={` text-blue-900  font-medium ${
                !isLoading ? "hover:underline cursor-pointer" : "cursor-no-drop"
              }`}
            >
              Sign up now
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
