const SideBarChatSkeleton = () => {
  return (
    <ul className="menu bg-base-300 rounded-box w-full h-full flex flex-row md:flex-col ">
      {[...Array(3)].map((_, index) => (
        <li key={index} className="menu-disabled">
          <div className="flex w-full flex-col gap-4 ">
            <div className="flex items-center md:items-start gap-4 w-fit md:w-full ">
              <div className="skeleton h-8 w-8 md:w-10 md:h-10 shrink-0 rounded-full"></div>
              <div className=" flex-col gap-4 hidden md:flex w-full ">
                <div className="skeleton h-4 w-1/3"></div>
                <div className="skeleton h-4 w-2/3"></div>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default SideBarChatSkeleton;
