import ChattedUserInfor from "../components/ChattedUserInfor";
import ChattedContent from "../sections/ChattedContent";

import SideBar from "../sections/SideBar";
const HomePage = () => {
  return (
    <div className=" w-full h-full ">
      <div className="w-full h-full md:h-full flex-col flex md:flex-row gap-1 overflow-hidden relative">
        <SideBar />
        <div className="bg-base-100 flex flex-1 flex-col relative">
          <div className="h-fit md:min-h-[5vw] w-full">
            <ChattedUserInfor />
          </div>
          <div className=" flex-1 rounded-br-lg rounded-bl-lg flex flex-col">
            <ChattedContent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
