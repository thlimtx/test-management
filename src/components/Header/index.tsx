import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAppleWhole } from "@fortawesome/free-solid-svg-icons";

export const Header = (props: any) => {
  return (
    <div className="shadow bg-white p-2 flex-row items-center">
      <div>Title</div>
      <FontAwesomeIcon icon={faAppleWhole} size="sm" />
    </div>
  );
};
