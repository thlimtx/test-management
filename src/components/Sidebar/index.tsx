import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartSimple,
  faListCheck,
  faScrewdriverWrench,
  faVialCircleCheck,
  faCloudArrowUp,
  faCircleInfo,
  faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import { includes, map, words } from "lodash";
import { useRouter } from "next/router";

export const Sidebar = (props: any) => {
  const router = useRouter();

  const sidebarContent = [
    { id: "dashboard", name: "Dashboard", icon: faChartSimple },
    { id: "requirement", name: "Requirements", icon: faListCheck },
    { id: "build", name: "Build", icon: faScrewdriverWrench },
    { id: "test-plan", name: "Test Plan", icon: faVialCircleCheck },
    { id: "deploy", name: "Deploy", icon: faCloudArrowUp },
    { id: "details", name: "Details", icon: faCircleInfo },
  ];

  const renderSidebarItem = (item: (typeof sidebarContent)[0]) => {
    return (
      <div className={` flex flex-row items-center`}>
        <div className="flex w-16 h-16 items-center justify-center">
          <FontAwesomeIcon icon={item.icon} size="lg" />
        </div>
        {item.name}
      </div>
    );
  };
  return (
    <div className="sidebar bg-primaryBg justify-between flex flex-col">
      <div>
        {map(sidebarContent, (item, index) => {
          const currentPage = words(router.asPath);
          const isCurrentPage = includes(currentPage, item.id);
          return (
            <div
              key={index}
              className={`sidebar-item ${isCurrentPage ? "text-primary" : ""}`}
              onClick={() =>
                router.push("/project/" + router.query.id + "/" + item.id)
              }
            >
              {renderSidebarItem(item)}
            </div>
          );
        })}
      </div>
      <div className="sidebar-exit" onClick={() => router.push("/")}>
        {renderSidebarItem({
          id: "exit",
          name: "Exit",
          icon: faRightToBracket,
        })}
      </div>
    </div>
  );
};
