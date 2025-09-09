import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "../sections/NavBar";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { useChatStore } from "../store/useChatStore";

import LoadingPageSkeleton from "../components/LoadingPageSkeleton";
import { useChatRealtimeStore } from "../store/useChatRealtimeStore";

const MainLayout = () => {
  const navigate = useNavigate();
  const authUser = useAuthStore((state) => state.authUser);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const setSelectedChat = useChatStore((state) => state.setSelectedChat);
  const getChattedUsers = useChatStore((state) => state.getChattedUsers);
  const subscribeToMessages = useChatRealtimeStore(
    (state) => state.subscribeToMessages
  );
  const unSubscribeToMessages = useChatRealtimeStore(
    (state) => state.unSubscribeToMessages
  );
  const theme = useThemeStore((state) => state.theme);
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  useEffect(() => {
    if (!isCheckingAuth && !authUser) navigate("/stranger/sign-in");
    else if (!isCheckingAuth && authUser) {
      const getData = async () => {
        try {
          setSelectedChat(null);
          await getChattedUsers();
        } catch (error) {
          // console.error("Error get chat data ", error);
        }
      };
      getData();
      subscribeToMessages();
    }

    return () => unSubscribeToMessages();
  }, [isCheckingAuth, authUser]);

  if ((isCheckingAuth && !authUser) || isCheckingAuth)
    return (
      <div className="w-full h-screen">
        <LoadingPageSkeleton />
      </div>
    );
  if (!isCheckingAuth && authUser)
    return (
      <div className=" w-full h-screen flex flex-col" data-theme={theme}>
        <NavBar />
        <main className="px-[var(--padding-x)] py-[var(--padding-x)] md:py-3 flex-1 flex max-h-[calc(100vh-8vh)] ">
          <div className="card rounded-box w-full h-full shadow-[0_1px_8px_#00000025] p-1">
            <Outlet />
          </div>
        </main>
      </div>
    );
};

export default MainLayout;
