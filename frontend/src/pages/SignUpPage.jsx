import { useForm, useWatch } from "react-hook-form";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlayCircle,
  FaRegEye,
  FaRegEyeSlash,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { GrFormNextLink } from "react-icons/gr";
import toast from "react-hot-toast";
import { signUp } from "../services/authService";
import { passwordRequire, checkPassword } from "../utils/validate";

const validateForm = (formData, passValid) => {
  if (!formData.fullName.trim()) return toast.error("Full name is required");

  if (!formData.email.trim()) return toast.error("Email is required");

  if (!formData.password.trim()) return toast.error("Password is required");

  if (!passValid) return toast.error("Invalid password format.");

  if (formData.password !== formData.confirmPassword)
    return toast.error("Passwords do not match!");

  return 0; //Not show any toast = 0 = not have error
};

const PasswordInput = ({ control, isLoading, setPassValid, register }) => {
  const password = useWatch({ control, name: "password" });
  const [showPass, setShowPass] = useState(false);
  useEffect(() => {
    const allValid = passwordRequire.every((r) =>
      checkPassword(password, r.id)
    );
    if (allValid) setPassValid(allValid);
  }, [password]);

  return (
    <div className="w-full">
      <label className="input relative flex items-center gap-2">
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
          className="w-full px-2 py-1"
          autocomplete="new-password"
        />
        <button
          type="button"
          aria-label={showPass ? "Hide password" : "Show password"}
          className="text-xl flex items-center cursor-pointer text-gray-400"
          onClick={() => setShowPass((prev) => !prev)}
        >
          {showPass ? <FaRegEyeSlash /> : <FaRegEye />}
        </button>
      </label>

      <ul className="w-full pt-2 pl-1">
        {passwordRequire.map((require) => {
          const isValid = checkPassword(password, require.id);
          return (
            <li
              key={require.id}
              className="text-[10px] md:text-sm flex items-center gap-2"
            >
              {isValid ? (
                <FaCheck className="text-green-500 text-xs" />
              ) : (
                <FaTimes className="text-red-400 text-xs" />
              )}
              <span className={isValid ? "text-green-500" : "text-gray-400"}>
                {require.title}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

function AvatarPreview({ control, isLoading, setValue }) {
  const fullName = useWatch({ control, name: "fullName" });
  const profilePicURL = useWatch({ control, name: "profilePicURL" });
  const profilePic = useWatch({ control, name: "profilePic" });
  const urlRef = useRef(null);

  const handleUploadAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Revoke URL cũ nếu có
    if (profilePicURL) URL.revokeObjectURL(profilePicURL);

    const url = URL.createObjectURL(file);
    urlRef.current = url;

    const reader = new FileReader();
    reader.onload = () => {
      setValue("profilePic", reader.result);
      setValue("profilePicURL", url);
    };
    reader.readAsDataURL(file);
  };

  // Dọn Blob URL khi unmount
  useEffect(() => {
    return () => {
      const u = urlRef.current || profilePicURL;
      if (u) URL.revokeObjectURL(u);
    };
  }, [profilePicURL]);
  const src = !profilePic
    ? `https://ui-avatars.com/api/?name=${fullName}`
    : profilePicURL;

  return (
    <>
      <img src={src} alt="avatar" />
      <input
        type="file"
        accept="image/*"
        className={`absolute top-0 left-0  h-full ${
          !isLoading ? "cursor-pointer" : "cursor-no-drop"
        } text-transparent`}
        onChange={handleUploadAvatar}
        disabled={isLoading}
      />
    </>
  );
}

const FormSignUp = ({ isLoading, setIsLoading, navigate }) => {
  const { control, register, handleSubmit, setValue } = useForm({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePic: "",
    profilePicURL: "",
  });
  const [passValid, setPassValid] = useState(false);

  const onSubmit = async (data) => {
    if (validateForm(data, passValid) != 0) return;

    setIsLoading(true);
    try {
      const standardData = {
        ...data,
        profilePic:
          data.profilePic == ""
            ? `https://ui-avatars.com/api/?name=${data.fullName}`
            : data.profilePic,
      };
      await signUp(standardData);
      toast.success("Sign up successfully!");
      if (data.profilePicURL) URL.revokeObjectURL(data.profilePicURL);
      navigate("/stranger/sign-in");
    } catch (error) {
      // console.error("Sign in error", error);
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className=" w-full  flex flex-col justify-center gap-7 md:gap-8 items-center"
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
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </g>
        </svg>
        <input
          {...register("fullName")}
          name="fullName"
          type="text"
          placeholder="fullname"
          disabled={isLoading}
          autocomplete="new-fullName"
        />
      </label>
      <label className="input">
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
          autocomplete="new-email"
        />
      </label>
      <PasswordInput
        register={register}
        control={control}
        isLoading={isLoading}
        setPassValid={setPassValid}
      />
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
          {...register("confirmPassword")}
          name="confirmPassword"
          placeholder="confirm password"
          type="password"
          disabled={isLoading}
          autocomplete="new-password"
        />
      </label>

      <div className="avatar flex flex-col gap-1 items-center">
        <p className="text-xs lg:text-sm text-gray-500">
          Use this avatar or click to change it.
        </p>
        <div className="w-24 rounded-full  relative">
          <AvatarPreview
            control={control}
            isLoading={isLoading}
            setValue={setValue}
          />
        </div>
      </div>

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

const SignUpPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-200">
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
      <div className="overflow-auto scrollbar-hide w-full max-w-[90vw] md:min-w-[400px] md:max-w-[400px] h-4/5 bg-blue-100/80 rounded-lg shadow-lg px-5 md:px-10 relative">
        <div className="flex flex-col items-center mt-10 mb-15 text-blue-900">
          <div className="text-2xl font-bold">SIGN UP</div>
        </div>

        <FormSignUp
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          navigate={navigate}
        />

        <div className=" text-center text-sm mt-10 mb-5">
          <p className="text-gray-400">
            Already have an account?{" "}
            <button
              type="button"
              disabled={isLoading}
              onClick={() => navigate("/stranger/sign-in")}
              className={` text-blue-900  font-medium ${
                !isLoading ? "hover:underline cursor-pointer" : "cursor-no-drop"
              }`}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
