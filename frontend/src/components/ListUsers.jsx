import { useNavigate } from "react-router-dom";
import { TiMessages } from "react-icons/ti";
import PATH from "../routes/path";
import { useChatStore } from "../store/useChatStore";
const ListUsers = ({ resultArray, onlineUsers, css }) => {
  const navigate = useNavigate();
  const setSelectedChat = useChatStore((state) => state.setSelectedChat);
  const chattedUsers = useChatStore((state) => state.chattedUsers);
  const handleButtonChat = (user) => {
    const chat = chattedUsers.find(
      (chat) => chat.users.length == 1 && chat.users[0]._id == user._id
    );
    if (chat) setSelectedChat(chat);
    else
      setSelectedChat({
        name: "",
        users: [
          {
            _id: user._id,
            fullName: user.fullName,
            profilePic: user.profilePic,
          },
        ],
      });
    navigate(PATH.HOME);
  };
  return (
    <ul
      className={`list flex-1 bg-base-100 rounded-box h-fit w-full flex gap-3 ${css}`}
    >
      {resultArray.map((result, index) => (
        <li key={index} className="list-row ">
          <div className="text-4xl font-thin opacity-30 tabular-nums">
            {index < 10 ? "0" + (index + 1) : index + 1}
          </div>
          <div>
            <img className="size-10 rounded-box" src={result.profilePic} />
          </div>
          <div className="list-col-grow">
            <div className="line-clamp-1 font-bold">{result.fullName}</div>
            {onlineUsers.some((user) => user == result._id) && (
              <div className="text-xs font-semibold opacity-60 text-green-700">
                Online
              </div>
            )}
          </div>
          <button
            className="btn btn-square"
            onClick={() => handleButtonChat(result)}
          >
            <TiMessages className="text-base md:text-lg" />
          </button>
        </li>
      ))}
    </ul>
  );
};

export default ListUsers;
