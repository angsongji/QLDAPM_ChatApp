import { useState } from "react";
import SideBarChatCTA from "../components/SideBarChatCTA";
import { IoIosArrowDown } from "react-icons/io";
import SideBarChat from "./SideBarChat";
import { useChatStore } from "../store/useChatStore";
const MobileButtonShowSideBar = ({ setShowSideBar }) => {
  const chattedUsers = useChatStore((state) => state.chattedUsers);

  return (
    <div
      className="flex md:hidden justify-center items-center rounded-sm h-fit gap-1"
      onClick={() => setShowSideBar((prev) => !prev)}
    >
      <button
        type="button"
        className="bg-base-100 px-1 rounded-bl-md rounded-br-md"
      >
        <IoIosArrowDown />
      </button>
      {chattedUsers.some(
        (chat) => chat.newMessage !== undefined && chat.newMessage
      ) && (
        <div className="inline-grid *:[grid-area:1/1]">
          <div className="status status-sm status-primary animate-ping"></div>
          <div className="status status-sm status-primary "></div>
        </div>
      )}
    </div>
  );
};
const SideBar = () => {
  const [showSideBar, setShowSideBar] = useState(false);
  return (
    <div
      className={`transition duration-250 ease-linear flex flex-col min-h-fit w-full md:w-1/4 md:h-full max-h-[100vh] md:scale-100 md:translate-y-0 absolute md:relative z-10 top-0 left-0 md:left-0 md:translate-x-0
        ${showSideBar ? "translate-y-0" : "-translate-y-[90%]"}
        `}
    >
      <div className="h-fit md:min-h-[5vw] flex items-end bg-base-100">
        <SideBarChatCTA />
      </div>
      <div className="h-fit md:flex-1 bg-base-100">
        <SideBarChat />
      </div>
      <MobileButtonShowSideBar setShowSideBar={setShowSideBar} />
    </div>
  );
};

export default SideBar;
