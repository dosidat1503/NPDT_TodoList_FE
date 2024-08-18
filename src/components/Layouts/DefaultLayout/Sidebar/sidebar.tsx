import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import todoListLogo from "../../../../assets/todoListLogo.png";
import {
  faArrowRightFromBracket,
  faListCheck,
} from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";

export const logout = () => {
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
  localStorage.removeItem("userInfo");
  window.location.href = "/login";
};

export default function Sidebar() {
  return (
    <div className="bg-blue-950 px-4 py-10 ">
      {/* logo */}
      <div className="  bg-bgMain flex justify-center items-center rounded-lg">
        <img src={todoListLogo} className="h-16 w-16"></img>
      </div>

      {/* pages */}
      <ul className="px-3 my-10">
        <li className="my-3 py-2 bg-bgMain flex justify-center items-center rounded-lg">
          <FontAwesomeIcon icon={faListCheck} className="text-2xl" />
          <h2 className="font-bold text-xl ml-3">TASK</h2>
        </li>
        <li className="flex justify-center">
          <button
            className="flex justify-center mt-1 items-center"
            onClick={() => logout()}
          >
            <FontAwesomeIcon
              icon={faArrowRightFromBracket}
              className="text-2xl text-white"
            />
            <h2 className="text-white text-lg font-bold ml-3">Logout</h2>
          </button>
        </li>
      </ul>
    </div>
  );
}
