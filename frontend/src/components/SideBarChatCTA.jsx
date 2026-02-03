import { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { useChatStore } from "../store/useChatStore";
import { useThemeStore } from "../store/useThemeStore";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import { getUsers } from "../services/userService";
import { updateChat } from "../services/chatService";
import { containsNormalized } from "../utils/searchUsers";
import LoadingPageSkeleton from "./LoadingPageSkeleton";
import toast from "react-hot-toast";
function InputName({ setChatData, initialName = "" }) {
  const [name, setName] = useState(initialName);
  useEffect(() => {
    setName(initialName);
  }, [initialName]);
  useEffect(() => {
    setChatData((prev) => ({ ...prev, name }));
  }, [name]);
  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">Group name</legend>
      <input
        type="text"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
        className="input input-sm"
        placeholder="Brother sister group"
      />
    </fieldset>
  );
}

function SearchUsers({ selectedUsers, setSelectedUsers }) {
  const [users, setUsers] = useState([]); //array userIds
  const [filterUsers, setFilterUsers] = useState([]);
  const [valueSearch, setValueSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    try {
      const callApi = async () => {
        const result = await getUsers();
        setUsers(result.data);
      };
      callApi();
    } catch (error) {
      // console.error("get users ", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (valueSearch == "") setFilterUsers([]);
    else
      setFilterUsers(
        users.filter((user) => containsNormalized(user.fullName, valueSearch))
      );
  }, [valueSearch]);
  useEffect(() => { }, [valueSearch]);

  const handleClickSelectUsers = (user) => {
    const newSelectedUsers = selectedUsers.filter((u) => u._id != user._id);
    if (newSelectedUsers.length == selectedUsers.length)
      setSelectedUsers((prev) => [...prev, user]);
    else setSelectedUsers(newSelectedUsers);
  };
  return (
    <div className="relative">
      {isLoading ? (
        <div>Loading users ...</div>
      ) : (
        <>
          <label className="input input-sm b">
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
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input
              type="search"
              placeholder="Search"
              value={valueSearch}
              onChange={(e) => {
                setValueSearch(e.target.value);
              }}
            />
          </label>
          <div className="w-full h-fit flex flex-wrap absolute left-0 -bottom-1 translate-y-full rounded-md shadow-md bg-base-200 z-1">
            {filterUsers.map((user, index) => (
              <MemberTag
                key={index}
                user={user}
                handleButtonClick={handleClickSelectUsers}
                selected={selectedUsers.some((u) => u._id == user._id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const MemberTag = ({ user, handleButtonClick, selected = false }) => {
  return (
    <button
      type="button"
      onClick={() => handleButtonClick(user)}
      className={`btn btn-xs md:btn-sm flex items-center m-1 h-8 w-auto btn-outline ${selected && "btn-info "
        }`}
    >
      <div className="avatar h-[85%]">
        <div className="h-full w-auto aspect-square rounded-full">
          <img src={user.profilePic} />
        </div>
      </div>
      <div className="badge badge-xs w-fit max-w-15 line-clamp-1">
        {user.fullName}
      </div>
    </button>
  );
};

function SelectUsers({ setChatData, initialUsers = [] }) {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const callApi = async () => {
      try {
        const result = await getUsers();
        setAllUsers(result.data);
        // Set initial users nếu có
        if (initialUsers.length > 0) {
          const selected = result.data.filter((user) =>
            initialUsers.includes(user._id)
          );
          setSelectedUsers(selected);
        }
      } catch (error) {
        // console.error("get users", error);
      }
    };
    callApi();
  }, [initialUsers]);

  useEffect(() => {
    setChatData((prev) => ({
      ...prev,
      users: selectedUsers.map((user) => user._id),
    }));
  }, [selectedUsers]);
  const handleRemoveSelectUsers = (user) => {
    setSelectedUsers((prev) => prev.filter((u) => u._id != user._id));
  };
  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">Members</legend>
      <div className="flex flex-col gap-2">
        <SearchUsers
          selectedUsers={selectedUsers}
          setSelectedUsers={setSelectedUsers}
        />
        <div className="w-full h-fit max-h-[75px] md:max-h-[100px] overflow-auto flex flex-wrap rounded-md bg-base-100 border-base-300 border-1">
          {selectedUsers.map((user, index) => (
            <MemberTag
              key={index}
              user={user}
              handleButtonClick={handleRemoveSelectUsers}
            />
          ))}
        </div>
      </div>
      <p
        className={`${selectedUsers.length != 0 ? "block" : "hidden"
          } label cursor-auto`}
      >
        To delete someone, click on them.
      </p>
    </fieldset>
  );
}
export function FormNewGroup({
  showForm,
  setShowForm,
  theme,
  mode = "create",
  initialData = null
}) {
  const formRef = useRef();
  const isCreateNewChatLoading = useChatStore(
    (state) => state.isCreateNewChatLoading
  );
  const createNewChat = useChatStore((state) => state.createNewChat);
  const selectedChat = useChatStore((state) => state.selectedChat);
  const setSelectedChat = useChatStore((state) => state.setSelectedChat);
  const [isLoading, setIsLoading] = useState(false);
  const [chatData, setChatData] = useState({
    name: "",
    users: [],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (chatData.name == "") return toast.error("Group name is required");
    if (chatData.users.length < 2)
      return toast.error("A group has at least 2 members");

    try {
      setIsLoading(true);
      if (mode === "create") {
        await createNewChat(chatData);
      } else {
        await updateChat(selectedChat._id, chatData);
        toast.success("Group updated successfully");
      }
      setShowForm(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error updating group");
    } finally {
      setIsLoading(false);
    }
  };

  const isCreate = mode === "create";
  const title = isCreate ? "Create new group" : "Edit group";
  const buttonText = isCreate ? "Create" : "Update";
  const loadingState = isCreate ? isCreateNewChatLoading : isLoading;

  return (
    <>
      <dialog
        ref={formRef}
        className={`
        ${showForm
            ? "translate-y-0 z-10 opacity-100"
            : "-translate-y-full opacity-0 z-0"
          }
        block w-full shadow-md h-[60vh] md:h-full absolute cursor-pointer rounded-md left-0 top-0 transition duration-200 ease-linear`}
      >
        {loadingState ? (
          <div className="w-full h-full">
            <LoadingPageSkeleton />
          </div>
        ) : (
          <div className="w-full h-full p-2 md:p-3 " data-theme={theme}>
            <div className="w-full">
              <button
                className="btn btn-xs btn-ghost"
                onClick={() => setShowForm(false)}
              >
                <FaLongArrowAltLeft size={15} />
                Cancel
              </button>
            </div>
            <div className="py-2 flex flex-col gap-2 w-full h-full">
              <h1 className="font-semibold text-xl md:text-2xl cursor-auto">
                {title}
              </h1>
              <form onSubmit={handleSubmit} className=" flex-1 flex flex-col">
                <InputName
                  setChatData={setChatData}
                  initialName={initialData?.name || ""}
                />
                <SelectUsers
                  setChatData={setChatData}
                  initialUsers={initialData?.users || []}
                />
                <div className=" w-full h-full flex justify-center items-center mt-5 flex-1">
                  <button type="submit" className="btn">
                    {buttonText}
                    <MdOutlineCreateNewFolder size={20} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
const SideBarChatCTA = () => {
  const isCheckedShowOnline = useChatStore(
    (state) => state.isCheckedShowOnline
  );
  const setIsCheckedShowOnline = useChatStore(
    (state) => state.setIsCheckedShowOnline
  );
  const theme = useThemeStore((state) => state.theme);
  const [showForm, setShowForm] = useState(false);
  return (
    <div className="w-full" data-theme={theme}>
      <div className="w-full flex items-end justify-between flex-wrap-reverse gap-1 py-2 md:py-1 relative z-1">
        <label className="label w-fit h-fit text-auto">
          <input
            type="checkbox"
            className="checkbox checkbox-xs md:checkbox-sm"
            checked={isCheckedShowOnline}
            onChange={() => setIsCheckedShowOnline(!isCheckedShowOnline)}
          />
          Show online
        </label>
        <button className="btn btn-xs" onClick={() => setShowForm(true)}>
          <FaPlus />
          New group
        </button>
      </div>
      {
        showForm && (
          <FormNewGroup
            showForm={showForm}
            setShowForm={setShowForm}
            theme={theme}
            mode="create"
          />
        )
      }

    </div>
  );
};

export default SideBarChatCTA;
