import { useChatStore } from "../store/useChatStore";
import SideBarChatSkeleton from "../components/SideBarChatSkeleton";
import SideBarChattedUsers from "../components/SideBarChattedUsers";

const SideBarChat = () => {
  const isChattedUsersLoading = useChatStore(
    (state) => state.isChattedUsersLoading
  );

  return (
    <div className="w-full h-full">
      {isChattedUsersLoading ? (
        <SideBarChatSkeleton />
      ) : (
        <SideBarChattedUsers />
      )}
    </div>
  );
};

export default SideBarChat;
