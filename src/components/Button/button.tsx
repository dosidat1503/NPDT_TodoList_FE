import { Riple } from "react-loading-indicators";

import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ButtonProps {
  name: string;
  onClick: () => void;
  backgroundColor: string;
  textColor?: string;
  borderColor?: string;
  isLoading?: boolean;
}

export default function Button({
  name,
  onClick,
  backgroundColor,
  textColor,
  borderColor,
  isLoading = false,
}: ButtonProps) {
  return isLoading ? (
    <div className="loading">
      <Riple
        color="#309fff"
        size="small"
        text=""
        textColor=""
        style={{ width: "10px" }}
      />
    </div>
  ) : (
    <button
      onClick={() => onClick()}
      className={` btn ${backgroundColor} ${textColor} ${borderColor} border-2 ${borderColor ? `${borderColor}` : `${backgroundColor}`} `}
    >
      <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
      &nbsp;&nbsp;
      {name}
    </button>
  );
}
