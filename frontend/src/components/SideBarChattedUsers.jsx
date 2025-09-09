import { useChatStore } from "../store/useChatStore";
import { useChatRealtimeStore } from "../store/useChatRealtimeStore";
import { PiEmptyBold } from "react-icons/pi";
import { useEffect, useState } from "react";
const SideBarChatUsers = () => {
  const chattedUsers = useChatStore((state) => state.chattedUsers);
  const selectedChat = useChatStore((state) => state.selectedChat);
  const setSelectedChat = useChatStore((state) => state.setSelectedChat);
  const isCheckedShowOnline = useChatStore(
    (state) => state.isCheckedShowOnline
  );
  const setChattedUsers = useChatStore((state) => state.setChattedUsers);
  const onlineUsers = useChatRealtimeStore((state) => state.onlineUsers);
  const [chattedUsersAll, setChattedUsersAll] = useState(chattedUsers);

  useEffect(() => {
    if (!isCheckedShowOnline) setChattedUsers(chattedUsersAll);
    else {
      const filter = chattedUsersAll.filter((chattedUser) =>
        chattedUser.users.some((user) =>
          onlineUsers.some((userId) => userId == user._id)
        )
      );
      setChattedUsers(filter);
    }
  }, [isCheckedShowOnline]);
  return (
    <>
      <ul className="menu bg-base-300 rounded-box w-full h-full flex flex-row md:flex-col flex-nowrap overflow-auto scrollbar-hide">
        {chattedUsers.length == 0 ? (
          <div className="w-full h-full bg-base-300 flex justify-center items-center text-sm md:text-base gap-1">
            <PiEmptyBold className=" h-full text-base md:text-lg" />
            <div className="">No conversations</div>
          </div>
        ) : (
          <>
            {chattedUsers.map((chat, index) => (
              <li
                key={index}
                onClick={() => setSelectedChat(chat)}
                className={`w-20 md:w-full rounded-box ${
                  selectedChat?._id == chat._id ? "bg-base-100" : ""
                }`}
              >
                <a className="flex flex-col md:flex-row md:justify-between rounded-box ">
                  <div
                    className={`avatar ${
                      chat.users.some((user) =>
                        onlineUsers.some((userId) => userId == user._id)
                      ) && "avatar-online"
                    } w-8 md:w-10`}
                  >
                    <div
                      className={`${
                        chat.users.length == 1 ? "rounded-full" : "rounded-box"
                      } bg-base-100 w-full h-auto aspect-square`}
                    >
                      <img
                        className=""
                        src={
                          chat.users.length == 1
                            ? chat.users[0].profilePic
                            : "https://api.dicebear.com/9.x/thumbs/svg?seed=78"
                        }
                      />
                    </div>
                  </div>
                  <div className="flex md:hidden flex-1">
                    <div className=" flex items-center gap-2 text-sm justify-between">
                      <div className="text-[9px] text-center md:text-base line-clamp-1">
                        {chat.name.length == 0
                          ? chat.users[0].fullName
                          : chat.name}{" "}
                      </div>
                      {chat.newMessage !== undefined && chat.newMessage && (
                        <div className="inline-grid *:[grid-area:1/1]">
                          <div className="status status-sm status-primary animate-ping"></div>
                          <div className="status status-sm status-primary "></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="hidden md:block flex-1">
                    <div className=" flex items-center gap-2 text-sm justify-between">
                      <div className="text-sm md:text-base font-bold line-clamp-1">
                        {chat.name.length == 0
                          ? chat.users[0].fullName
                          : chat.name}
                      </div>
                      {chat.newMessage !== undefined && chat.newMessage && (
                        <div className="inline-grid *:[grid-area:1/1]">
                          <div className="status status-primary animate-ping"></div>
                          <div className="status status-primary "></div>
                        </div>
                      )}
                    </div>
                    {chat.users.some((user) =>
                      onlineUsers.some((userId) => userId == user._id)
                    ) && (
                      <div className="text-xs opacity-60 flex justify-between">
                        <span className="text-green-700">Online</span>
                      </div>
                    )}
                  </div>
                </a>
              </li>
            ))}
          </>
        )}
      </ul>
    </>
  );
};

export default SideBarChatUsers;
