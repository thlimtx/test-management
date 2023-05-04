import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAppleWhole } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../Button";

export const Header = (props: any) => {
  return (
    <div className="shadow bg-primaryBg p-2 flex-row items-center">
      <div>Title</div>
      {/* <FontAwesomeIcon icon={faAppleWhole} size="sm" /> */}
      <Button />
    </div>
  );
};
