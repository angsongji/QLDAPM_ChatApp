import {
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import ChatBubble from "./ChatBubble";
import { useAuthStore } from "../store/useAuthStore";
import { useMessageStore } from "../store/useMessageStore";
import { useChatStore } from "../store/useChatStore";

const ModalImage = forwardRef((_, ref) => {
  const imageDiaLogRef = useRef();
  const [imageSelected, setImageSelected] = useState({
    image: "",
    currentDate: "",
    time: "",
  });

  useImperativeHandle(ref, () => ({
    setImageSelected: (data) => setImageSelected(data),
    showModal: () => {
      imageDiaLogRef.current?.showModal();
    },
  }));

  return (
    <dialog
      ref={imageDiaLogRef}
      className={`${
        imageSelected.image == "" ? "hidden" : "block"
      } bg-base-100 w-fit h-fit absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-md shadow-md`}
      onClick={(e) => {
        const dialog = imageDiaLogRef.current;
        if (e.target === dialog) {
          dialog.close();
          setImageSelected({
            image: "",
            currentDate: "",
            time: "",
          });
        }
      }}
    >
      <div className=" w-[90vw] h-[60vh] md:w-[60vw] md:h-[90vh] p-3 relative flex justify-center items-center cursor-auto">
        <div className="w-full h-fit md:w-fit md:h-full">
          {imageSelected.image != "" && (
            <img
              src={imageSelected.image}
              className="w-full h-auto md:h-full md:w-auto rounded-sm object-contain"
            />
          )}
        </div>

        <div className=" text-right absolute bottom-2 right-1 italic px-3">
          {imageSelected.currentDate} {imageSelected.time}
        </div>
      </div>
    </dialog>
  );
});

const ChattedMessagesWrapper = () => {
  const messagesEndRef = useRef(null);
  const imageModalRef = useRef();
  const messages = useMessageStore((state) => state.messages);
  const authUser = useAuthStore((state) => state.authUser);
  const selectedChat = useChatStore((state) => state.selectedChat);

  const messagesByChatId =
    selectedChat == null || selectedChat._id == undefined
      ? []
      : messages.filter((msg) => msg.chatId === selectedChat._id);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesByChatId]);

  useLayoutEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [selectedChat]);

  if (!messagesByChatId) return null;
  return (
    <div className="relative flex flex-col gap-2 h-0">
      <ModalImage ref={imageModalRef} />
      {messagesByChatId.map((msg, index) => (
        <ChatBubble
          key={index}
          msg={msg}
          index={index}
          imageModalRef={imageModalRef}
          authUser={authUser}
          selectedChat={selectedChat}
          messagesByChatId={messagesByChatId}
        />
      ))}
      <div ref={messagesEndRef} className="" />
    </div>
  );
};

export default ChattedMessagesWrapper;
