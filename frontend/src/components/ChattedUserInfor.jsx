import { useImperativeHandle, forwardRef, useState, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useChatRealtimeStore } from "../store/useChatRealtimeStore";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import ListUsers from "./ListUsers";

const ShowMembersWrapper = forwardRef(({ selectedChat, onlineUsers }, ref) => {
  const [showMembers, setShowMembers] = useState(false);

  useImperativeHandle(ref, () => ({
    toggleMembers: () => setShowMembers((prev) => !prev),
    openMembers: () => setShowMembers(true),
    closeMembers: () => setShowMembers(false),
    isOpen: showMembers,
  }));

  return (
    <div
      className={`${
        showMembers ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
      } transition duration-300 ease-in fixed top-0 left-0 w-full h-full z-10 bg-base-300/70 flex justify-center items-center`}
    >
      <div className=" w-[90%] md:w-1/3 min-h-[500px] h-[80%] md:h-[90%] bg-base-100 shadow-md rounded-box p-2 md:p-3 flex flex-col">
        <div className="w-full flex items-center">
          <button type="button" onClick={() => setShowMembers((prev) => !prev)}>
            <IoIosArrowBack className="cursor-pointer text-lg md:text-xl lg:text-2xl" />
          </button>
          <span className="text-center block flex-1 font-bold text-base md:text-lg">
            Members
          </span>
        </div>
        <div className="flex-1 py-2 overflow-auto scrollbar-hide">
          <ListUsers
            resultArray={selectedChat.users}
            onlineUsers={onlineUsers}
          />
        </div>
      </div>
    </div>
  );
});

const ChattedUserInfor = () => {
  const membersRef = useRef();
  const selectedChat = useChatStore((state) => state.selectedChat);
  const onlineUsers = useChatRealtimeStore((state) => state.onlineUsers);
  const memOnline = selectedChat?.users.filter((user) =>
    onlineUsers.some((userId) => userId == user._id)
  );
  return (
    <>
      {selectedChat != null && (
        <>
          {selectedChat.users.length > 1 && (
            <ShowMembersWrapper
              ref={membersRef}
              selectedChat={selectedChat}
              onlineUsers={onlineUsers}
            />
          )}
          <div className="w-full h-[7vh] md:h-full flex px-4 bg-base-300 rounded-tl-box rounded-tr-box">
            <div className="flex justify-center md:justify-between gap-2 items-center w-full">
              <div
                className={`avatar ${
                  selectedChat.users.some((user) =>
                    onlineUsers.some((userId) => userId == user._id)
                  ) && "avatar-online"
                } h-[80%] w-auto aspect-square max-h-13`}
              >
                <div
                  className={`${
                    selectedChat.users.length == 1
                      ? "rounded-full"
                      : "rounded-box"
                  }`}
                >
                  <img
                    className=""
                    src={
                      selectedChat.users.length == 1
                        ? selectedChat.users[0].profilePic
                        : "https://api.dicebear.com/9.x/thumbs/svg?seed=78"
                    }
                  />
                </div>
              </div>
              <div className="block flex-1 w-full">
                <div className=" w-full h-fit flex items-center gap-2 text-sm md:text-base lg:text-lg justify-between">
                  <div className="font-bold line-clamp-1">
                    {selectedChat.name.length == 0
                      ? selectedChat.users[0].fullName
                      : selectedChat.name}
                  </div>
                  {selectedChat.users.length > 1 && (
                    <button
                      onClick={() => membersRef.current.toggleMembers()}
                      type="button"
                      className="cursor-pointer hover:scale-95 transition duration-200 ease-in-out text-xs md:text-sm flex gap-1 items-center font-light"
                    >
                      <span>Members:</span>
                      <span>{selectedChat.users.length + 1}</span>
                      <span>
                        <IoIosArrowForward className="text-gray-500 text-sm md:text-base" />
                      </span>
                    </button>
                  )}
                </div>
                {memOnline?.length != 0 && (
                  <div className="text-xs opacity-60 flex justify-between">
                    <span className="text-base-100 bg-green-700 px-1 rounded-md">
                      Online
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ChattedUserInfor;
