import { useRef, useState } from "react";
import { FaPencil } from "react-icons/fa6";
import { MdOutlineCancel } from "react-icons/md";
import { useAuthStore } from "../store/useAuthStore";
import { IoIosReverseCamera, IoIosSave } from "react-icons/io";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
const titles = [
  {
    title: "Full name",
    field: "fullName",
  },
  {
    title: "Email address",
    field: "email",
  },
  {
    title: "Member since",
    field: "createdAt",
  },
];

const AvatarAndUpdate = ({ authUser }) => {
  const uploadProfile = useAuthStore((state) => state.uploadProfile);
  const avatarRef = useRef();
  const [base64_url, setBase64_url] = useState("");
  const [blob_url, setBlob_url] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleUploadAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (blob_url) URL.revokeObjectURL(blob_url);

    const url = URL.createObjectURL(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      setBase64_url(reader.result);
      setBlob_url(url);
    };
  };

  const handleCancel = () => {
    if (blob_url) URL.revokeObjectURL(blob_url);

    setBase64_url("");
    setBlob_url("");
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await uploadProfile({ profilePic: base64_url });
      handleCancel();
    } catch (error) {
      // console.error("Sign in error", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full  py-10 gap-5">
      <div className="flex justify-evenly md:justify-center">
        <div className="avatar w-30 h-30 lg:w-45 lg:h-auto square relative p-1 ">
          <img
            ref={avatarRef}
            src={blob_url == "" ? authUser.profilePic : blob_url}
            className="rounded-full shadow-md aspect-square"
          />
          <button className="btn btn-circle absolute right-0 bottom-2 z-1">
            <IoIosReverseCamera className="text-2xl md:text-3xl " />
            <input
              type="file"
              accept="image/*"
              className={`absolute top-0 left-0 w-full h-full z-2 text-transparent !cursor-pointer   rounded-full`}
              onChange={handleUploadAvatar}
            />
          </button>
        </div>
        <div className={`${blob_url ? "flex flex-col gap-2" : "hidden"} `}>
          <p>Save changes?</p>
          <div className="flex gap-2">
            <button
              onClick={() => handleSave()}
              disabled={isLoading}
              className={`btn btn-info ${
                isLoading ? "cursor-no-drop" : "cursor-pointer"
              }`}
            >
              {isLoading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Save"
              )}
            </button>
            <button
              disabled={isLoading}
              className={`btn ${
                isLoading ? "cursor-no-drop" : "cursor-pointer"
              }`}
              onClick={() => handleCancel()}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <div className="font-bold flex flex-col items-center justify-center">
        <span className="text-base md:text-xl">{authUser.fullName}</span>
      </div>
    </div>
  );
};

const FormUpdateInforUser = ({ isUpdateMode, setIsUpdateMode, authUser }) => {
  const uploadProfile = useAuthStore((state) => state.uploadProfile);
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => {
    if (data.email.length === 0 && data.fullName.length === 0)
      return toast.error("No changes made");

    if (data.email === authUser.email || data.fullName === authUser.fullName)
      return toast.error("Value is the same");

    let dataSend = {};
    if (data.email.length > 0 && data.email !== authUser.email)
      dataSend.email = data.email;

    if (data.fullName.length > 0 && data.fullName !== authUser.fullName)
      dataSend.fullName = data.fullName;

    const sendData = async (data) => {
      try {
        document.body.style.cursor = "wait";
        await uploadProfile(data);
        setIsUpdateMode(false);
      } catch (error) {
        // console.log("erororororor ", error);
      } finally {
        document.body.style.cursor = "default";
      }
    };

    sendData(dataSend);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex gap-2 items-center justify-end text-xs md:text-sm mb-2">
        <button
          type="button"
          className={`${
            isUpdateMode ? "block" : "hidden"
          }  cursor-pointer  flex gap-1 items-center py-1 px-2 bg-base-100 rounded-md hover:bg-base-200`}
          onClick={() => setIsUpdateMode((prev) => !prev)}
        >
          <span>
            <MdOutlineCancel />
          </span>
          <span>Cancel</span>
        </button>
        <button
          type="submit"
          className={`${
            isUpdateMode ? "block" : "hidden"
          } cursor-pointer  flex gap-1 items-center py-1 px-2 bg-base-300 rounded-md`}
        >
          <span>
            <IoIosSave />
          </span>
          <span>Save</span>
        </button>
      </div>
      <div className="min-w-fit w-[70vw] md:w-[30vw] max-w-[500px] text-xs md:text-sm lg:text-base flex flex-col gap-3 lg:gap-5 items-center border border-base-300 py-3 px-5 rounded-box">
        {titles.map((item, index) => (
          <>
            {isUpdateMode && item.field != "createdAt" && (
              <div
                key={index}
                className="w-full grid md:grid-cols-[30%_70%] gap-1 items-center font-extralight border-b border-base-200"
              >
                <div className="text-xs md:text-sm">{item.title}</div>
                <input
                  type="text"
                  {...register(item.field)}
                  placeholder={authUser[item.field]}
                  className="input input-sm mb-1"
                />
              </div>
            )}
          </>
        ))}
      </div>
    </form>
  );
};

const WrapperInforUser = ({ authUser }) => {
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  return (
    <>
      {isUpdateMode ? (
        <FormUpdateInforUser
          isUpdateMode={isUpdateMode}
          setIsUpdateMode={setIsUpdateMode}
          authUser={authUser}
        />
      ) : (
        <div>
          <div className="flex gap-2 items-center justify-end text-xs md:text-sm mb-2">
            <button
              type="button"
              className={`${
                !isUpdateMode ? "block" : "hidden"
              } cursor-pointer  flex gap-1 items-center py-1 px-2 bg-base-200 rounded-md`}
              onClick={() => setIsUpdateMode((prev) => !prev)}
            >
              <span>
                <FaPencil />
              </span>
              <span>Update</span>
            </button>
          </div>
          <div className="min-w-fit w-[70vw] md:w-[30vw] max-w-[500px] text-xs md:text-sm lg:text-base flex flex-col gap-3 lg:gap-5 items-center border border-base-300 py-3 px-5 rounded-box">
            {titles.map((item, index) => (
              <div
                key={index}
                className="w-full grid md:grid-cols-[30%_70%] gap-1 items-center font-extralight border-b border-base-200"
              >
                <div className="text-xs md:text-sm">{item.title}</div>
                <div className="font-semibold">
                  {item.field != "createdAt"
                    ? authUser[item.field]
                    : authUser.createdAt
                        .split("T")[0]
                        .split("-")
                        .reverse()
                        .join("/")}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

const PrivateProfilePage = () => {
  const authUser = useAuthStore((state) => state.authUser);
  return (
    <div className="w-full h-full flex flex-col items-center gap-10 ">
      <AvatarAndUpdate authUser={authUser} />
      <WrapperInforUser authUser={authUser} />
    </div>
  );
};

export default PrivateProfilePage;
