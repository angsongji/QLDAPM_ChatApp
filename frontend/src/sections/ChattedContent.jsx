import { useState, useRef } from "react";
import { IoMdImages, IoIosClose } from "react-icons/io";
import { useChatStore } from "../store/useChatStore";
import { useMessageStore } from "../store/useMessageStore";

import LoadingPageSkeleton from "../components/LoadingPageSkeleton";
import { FaPaperPlane } from "react-icons/fa6";

import ChattedContentBegin from "../components/ChattedContentBegin";
import EmojiPickerWrapper from "../components/EmojiPickerWrapper";
import ChattedMessagesWrapper from "../components/ChattedMessagesWrapper";
import toast from "react-hot-toast";

const FormInputMessage = () => {
  const fileInputRef = useRef(null);
  const selectedChat = useChatStore((state) => state.selectedChat);
  const isSendMessageLoading = useMessageStore(
    (state) => state.isSendMessageLoading
  );
  const sendMessage = useMessageStore((state) => state.sendMessage);
  const sendMessageToStranger = useMessageStore(
    (state) => state.sendMessageToStranger
  );
  const [message, setMessage] = useState("");
  const [imageURL, setImageURL] = useState({
    base64_url: "",
    blob_url: "",
  });
  const handleSubmitMessage = async (e) => {
    e.preventDefault();
    const messageData = {
      text: message,
      image: imageURL.base64_url,
    };
    try {
      setMessage("");
      handleRemoveImage();
      if (selectedChat._id == undefined) {
        const messageDataStranger = {
          ...messageData,
          users: [selectedChat.users[0]._id],
          name: "",
        };
        await sendMessageToStranger(messageDataStranger);
      } else await sendMessage(messageData, selectedChat._id);
    } catch (error) {
      // console.error("Error in send message ", error);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Only accept image file.");
      return;
    }

    const maxSize = 1 * 1024 * 1024; // 1MB
    if (file.size > maxSize) {
      toast.error("Maximum file size: 1MB (1024KB).");
      return;
    }

    if (imageURL.blob_url) URL.revokeObjectURL(imageURL.blob_url);
    const url = URL.createObjectURL(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      setImageURL({
        base64_url: reader.result,
        blob_url: url,
      });
    };
  };

  const handleRemoveImage = () => {
    URL.revokeObjectURL(imageURL.blob_url);
    setImageURL({
      base64_url: "",
      blob_url: "",
    });
  };

  return (
    <form
      onSubmit={handleSubmitMessage}
      className="flex flex-col gap-2 items-center sticky bottom-0 bg-base-100 z-2 px-4 py-2"
    >
      {imageURL.blob_url != "" && (
        <div className="w-full h-fit absolute rounded-md top-0 z-1 left-1/2 -translate-x-[50%] -translate-y-[110%] flex gap-3 md:gap-4 justify-center bg-base-100/30 py-1">
          <div className="h-24 w-auto relative shadow-md">
            <img
              src={imageURL.blob_url}
              className="object-contain w-full h-full"
            />
            <button
              type="button"
              className="bg-base-200 absolute top-0 right-0 translate-x-1/2 rounded-full cursor-pointer"
              onClick={handleRemoveImage}
            >
              <IoIosClose className="text-base md:text-xl" />
            </button>
          </div>
        </div>
      )}

      <div
        className={`${
          isSendMessageLoading ? "block" : "hidden"
        } px-4 absolute right-0 bottom-0 w-full h-fit text-right text-xs md:text-sm -translate-y-[140%] py-1 z-1 bg-base-200`}
      >
        <div
          className={`${
            isSendMessageLoading ? "opacity-100" : "opacity-0"
          } transition-all duration-500 ease-in-out flex gap-2 justify-end`}
        >
          <span>Sending message...</span>
          <div className="w-5 aspect-square">
            <div className="loader !w-full !h-full"></div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-5 w-full">
        <div className="flex items-center">
          <button
            type="button"
            className="cursor-pointer relative"
            onClick={handleClick}
          >
            <IoMdImages size={25} className="" />
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleChange}
            className="hidden"
          />
        </div>
        <EmojiPickerWrapper setMessage={setMessage} />

        <label className="input rounded-box flex-1 border-none h-8">
          <input
            type="search"
            required
            placeholder="Aa..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </label>
        <button
          type="submit"
          className="cursor-pointer"
          disabled={message == "" && imageURL.blob_url == ""}
        >
          <FaPaperPlane
            size={20}
            className={`${
              message == "" && imageURL.blob_url == "" && "text-base-300"
            }`}
          />
        </button>
      </div>
    </form>
  );
};

const ChatWindow = () => {
  return (
    <div className=" w-full flex flex-col-reverse gap-4 min-h-full max-h-[calc(100vh-25vh)]">
      <FormInputMessage />
      <div className="flex-1 px-4 overflow-auto scrollbar-hide">
        <ChattedMessagesWrapper />
      </div>
    </div>
  );
};

const ChattedContent = () => {
  const selectedChat = useChatStore((state) => state.selectedChat);
  const isGetMessagesLoading = useMessageStore(
    (state) => state.isGetMessagesLoading
  );
  if (selectedChat == null) return <ChattedContentBegin />;
  return (
    <div className="w-full h-full">
      {isGetMessagesLoading ? <LoadingPageSkeleton /> : <ChatWindow />}
    </div>
  );
};

export default ChattedContent;
