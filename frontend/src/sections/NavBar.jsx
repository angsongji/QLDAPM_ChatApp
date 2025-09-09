import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { FaPlayCircle } from "react-icons/fa";
import { IoCheckmark } from "react-icons/io5";
import { GrFormNextLink } from "react-icons/gr";
import PATH from "../routes/path";
import { useState } from "react";

const themes = ["light", "dark", "cupcake", "halloween"];
const ContentSignIn = () => {
  const authUser = useAuthStore((state) => state.authUser);
  const logOut = useAuthStore((state) => state.logOut);
  const theme = useThemeStore((state) => state.theme);
  const changeTheme = useThemeStore((state) => state.changeTheme);
  const [valueSearch, setValueSearch] = useState("");
  const navigate = useNavigate();
  const handleLogOut = async () => {
    await logOut();
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`${PATH.SEARCH_USERS}?value=${valueSearch}`);
    setValueSearch("");
  };
  return (
    <div className="flex gap-1 md:gap-2 justify-end items-center">
      <form
        onSubmit={handleSubmit}
        className="flex gap-1 items-center justify-center"
      >
        <label className="input input-xs md:input-sm lg:input-base !w-2/3 md:!w-auto">
          <svg
            className="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input
            type="search"
            value={valueSearch}
            onChange={(e) => setValueSearch(e.target.value)}
            required
            placeholder="Search people"
          />
        </label>
        <button type="submit" className="cursor-pointer block md:hidden">
          <GrFormNextLink />
        </button>
      </form>

      <div className="flex-none ">
        <ul className="menu menu-horizontal !p-1 menu-xs md:menu-sm lg:menu-base">
          <li>
            <details>
              <summary>Theme</summary>
              <ul className="bg-base-100 rounded-t-none p-2 z-11">
                {themes.map((item, index) => (
                  <li key={index} onClick={() => changeTheme(item)}>
                    <a>
                      {item}
                      {theme == item && (
                        <span className="badge">
                          <IoCheckmark />
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          </li>
        </ul>
      </div>
      <div className="dropdown dropdown-end">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-circle avatar"
        >
          <div className="ring-primary ring-offset-base-100 w-6 md:w-8  rounded-full ring-2 ring-offset-2">
            <img alt="Your avatar" src={authUser.profilePic} />
          </div>
        </div>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
        >
          <li>
            <Link className="justify-between" to={PATH.PRIVATE_PROFILE}>
              My Profile
            </Link>
          </li>
          <li onClick={() => handleLogOut()}>
            <a className="text-red-500">Logout</a>
          </li>
        </ul>
      </div>
    </div>
  );
};
const Navbar = () => {
  return (
    <div className="navbar bg-base-100 shadow-sm px-[var(--padding-x)] flex justify-between min-h-[8vh]">
      <div className="btn btn-sm md:btn-base lg:btn-lg btn-ghost w-fit flex gap-1  items-center !px-0 hover:bg-transparent border-0">
        <FaPlayCircle className="" />
        <Link to="/" className="font-bold ">
          FunTogether
        </Link>
      </div>
      <ContentSignIn />
    </div>
  );
};

export default Navbar;
