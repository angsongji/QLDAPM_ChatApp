const ChatBubble = ({
  msg,
  index,
  imageModalRef,
  authUser,
  selectedChat,
  messagesByChatId,
}) => {
  const isCurrentUser = msg.senderId === authUser._id;
  const isSameSenderAsPrevious =
    index > 0 && messagesByChatId[index - 1].senderId === msg.senderId;
  const sender = isCurrentUser
    ? authUser
    : selectedChat.users.find((u) => u._id === msg.senderId);

  const currentDateObj = new Date(msg.createdAt);
  const previousDateObj =
    index > 0 ? new Date(messagesByChatId[index - 1].createdAt) : null;

  const currentDate = currentDateObj.toLocaleDateString("vi-VN");
  const previousDate = previousDateObj?.toLocaleDateString("vi-VN");
  const time = currentDateObj.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const openModal = () => {
    imageModalRef?.current.setImageSelected({
      image: msg.image,
      currentDate,
      time,
    });

    if (imageModalRef.current) {
      imageModalRef.current.showModal();
    }
  };

  return (
    <div className="">
      {currentDate !== previousDate && (
        <div className="  w-full flex justify-center items-center">
          <div className="divider text-xs w-1/2 md:w-1/4">{currentDate}</div>
        </div>
      )}

      <div
        className={` flex items-end gap-2 ${
          isCurrentUser ? "justify-end" : "justify-start"
        }`}
      >
        {((!isCurrentUser && !isSameSenderAsPrevious && sender) ||
          (!isCurrentUser && currentDate !== previousDate && sender)) && (
          <img
            loading="lazy"
            src={sender.profilePic}
            alt="Avatar"
            className="w-8 h-8 object-cover rounded-full"
          />
        )}
        {!isCurrentUser &&
          isSameSenderAsPrevious &&
          currentDate === previousDate && <div className="w-8 h-8" />}
        <div
          className={`border border-base-200 relative group flex flex-col gap-2 px-4 py-2 rounded-xl text-xs md:text-sm  max-w-[75%] ${
            isCurrentUser
              ? "bg-base-100 rounded-br-none"
              : "bg-base-300 rounded-bl-none"
          }`}
        >
          {msg.image != "" && (
            <div
              className="w-fit h-fit relative shadow-md cursor-pointer"
              onClick={openModal}
            >
              <img
                src={msg.image}
                className="object-contain w-[35vw] h-auto max-h-[30vw] md:min-h-0 md:max-h-[15vw] md:w-auto rounded-sm"
                loading="lazy"
              />
            </div>
          )}
          <div className="w-full flex flex-col gap-1">
            <div className="=">{msg.text}</div>
            <div
              className={`block md:hidden text-[8px] ${
                isCurrentUser ? "text-right" : "text-left"
              } `}
            >
              {time}
            </div>
          </div>
          <div
            className={`hidden absolute group-hover:block shadow-sm shadow-base-100 top-1/2 translate-y-[-50%] p-1 text-xs bg-base-300 rounded-md text-gray-400 ${
              isCurrentUser
                ? "left-0 -translate-x-[110%]"
                : "right-0 translate-x-[110%]"
            }`}
          >
            {time}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
