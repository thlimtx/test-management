import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAppleWhole } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../Button";

export const Header = (props: any) => {
  const router = useRouter();
  return (
    <div
      className={`fixed header-height mb-1 w-full shadow bg-primaryBg p-2 flex flex-row items-center ${props.className}`}
      style={props.style}
    >
      <div className="flex-1 flex flex-row px-2">
        <img src="https://picsum.photos/30" />
      </div>
      {/* <FontAwesomeIcon icon={faAppleWhole} size="sm" /> */}
      <Button
        text="Sign up"
        className="mr-2 rounded-full"
        type="invert"
        onPress={() => router.push("/signup")}
      />
      <Button
        text="Login"
        className="rounded-full"
        onPress={() => router.push("/login")}
      />
    </div>
  );
};
