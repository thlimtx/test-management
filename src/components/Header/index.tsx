import { useRouter } from "next/router";
import { Button } from "../Button";
import { useEffect, useState } from "react";
import { Project } from "@prisma/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { Dropdown, MenuProps } from "antd";
import { find, includes, map, without } from "lodash";
import { signIn, useSession } from "next-auth/react";

export const Header = (props: any) => {
  const router = useRouter();
  const projectId = router.query.id;
  const session = useSession();

  const user = session.data?.user;

  const [projects, setProjects] = useState<Project[]>();
  const curProject = find(projects, (o) => `${o.id}` === projectId);
  const projectOptions = map(without(projects, curProject), (item) => {
    return { key: `${item?.id}`, label: `${item?.name}` };
  });

  useEffect(() => {
    findProject(user?.email);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);
  useEffect(() => {
    if (
      !user &&
      (includes(router.asPath, "profile") ||
        includes(router.asPath, "project") ||
        includes(router.asPath, "home"))
    ) {
      router.push("/auth/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const findProject = async (item: any) => {
    const res = await fetch("/api/project/read", {
      method: "POST",
      body: JSON.stringify({ userEmail: item }),
    });
    if (res.ok) {
      const data = await res.json();
      setProjects(data);
    } else {
      setProjects([]);
    }
  };

  const onSelectProject: MenuProps["onClick"] = ({ key }) => {
    router.push("/project/" + key);
  };

  return (
    <div
      className={`fixed header-height mb-1 w-full shadow bg-primaryBg px-2 flex flex-row ${props.className}`}
      style={props.style}
    >
      <div className="flex-1 flex flex-row px-2 items-center">
        <img src="https://picsum.photos/30" />
      </div>
      <div className="flex flex-row mx-5">
        {projectId && (
          <Dropdown
            menu={{ items: projectOptions, onClick: onSelectProject }}
            trigger={["click"]}
          >
            <a onClick={(e) => e.preventDefault()}>
              <div
                id="type"
                className={`flex flex-row items-center button h-full`}
              >
                <p>{curProject?.name}</p>
                <span className="w-3" />
                <FontAwesomeIcon icon={faChevronDown} size="sm" />
              </div>
            </a>
          </Dropdown>
        )}
        <span className="w-5" />
        {user ? (
          <div className="flex-1 flex flex-row items-center">
            <img src="https://picsum.photos/30" className="mr-2 rounded-full" />
            <p>{user.name}</p>
          </div>
        ) : (
          <div className="flex flex-row items-center">
            <Button
              text="Sign up"
              className="mr-5 border-none shadow-none"
              type="invert"
              onPress={() => router.push("/auth/signup")}
            />
            <Button
              text="Login"
              className="border-none shadow-none"
              type="invert"
              onPress={() => signIn()}
            />
          </div>
        )}
      </div>
    </div>
  );
};
