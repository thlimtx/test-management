import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartSimple,
  faListCheck,
  faScrewdriverWrench,
  faVialCircleCheck,
  faCloudArrowUp,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import { includes, map, words } from "lodash";
import { useRouter } from "next/router";

export const Sidebar = (props: any) => {
  const router = useRouter();

  const sidebarContent = [
    { id: "dashboard", name: "Dashboard", icon: faChartSimple },
    { id: "requirements", name: "Requirements", icon: faListCheck },
    { id: "build", name: "Build", icon: faScrewdriverWrench },
    { id: "test", name: "Test", icon: faVialCircleCheck },
    { id: "deploy", name: "Deploy", icon: faCloudArrowUp },
    { id: "details", name: "Details", icon: faCircleInfo },
  ];
  return (
    <div className="sidebar bg-primaryBg">
      {map(sidebarContent, (item, index) => {
        const isCurrentPage = includes(words(router.asPath), item.id);
        console.log(isCurrentPage);

        return (
          <div key={index}>
            <div
              className={`flex flex-row items-center ${
                isCurrentPage ? "text-primary" : ""
              }`}
            >
              <div className="flex w-16 h-16 items-center justify-center">
                <FontAwesomeIcon icon={item.icon} size="lg" />
              </div>
              {item.name}
            </div>
          </div>
        );
      })}
    </div>
  );
};
