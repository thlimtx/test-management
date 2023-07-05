import { useRouter } from "next/router";
import { Button } from "../Button";
import { useEffect, useState } from "react";
import { Project } from "@prisma/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { Dropdown, Image, MenuProps } from "antd";
import { find, includes, isEmpty, map, without } from "lodash";
import { signIn, signOut, useSession } from "next-auth/react";

export const Header = (props: any) => {
  const router = useRouter();
  const projectId = router.query.id;
  const session = useSession();

  const user = session.data?.user;

  const [projects, setProjects] = useState<Project[]>();
  const curProject = find(projects, (o) => `${o.id}` === projectId);
  const projectOptions = map(
    projectId ? without(projects, curProject) : projects,
    (item) => {
      return { key: `${item?.id}`, label: `${item?.name}` };
    }
  );
  const profileOptions: MenuProps["items"] = [
    { key: "profile", label: "Profile" },
    { key: "logout", label: "Log out" },
  ];

  useEffect(() => {
    user && findProject(user?.email);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, user]);
  useEffect(() => {
    if (
      session.status !== "loading" &&
      !user &&
      (includes(router.asPath, "profile") ||
        includes(router.asPath, "project") ||
        includes(router.asPath, "home"))
    ) {
      router.push("/auth/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, session]);

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
    router.push("/project/" + key + "/dashboard");
  };
  const onSelectProfile: MenuProps["onClick"] = ({ key }) => {
    key === "profile" && router.push("/profile");
    key === "logout" && signOut();
  };

  return (
    <div
      className={`fixed header-height mb-1 w-full shadow bg-primaryBg px-2 flex flex-row ${props.className}`}
      style={props.style}
    >
      <div className="flex-1 flex flex-row px-5 items-center">
        <Image
          src="https://picsum.photos/30"
          preview={false}
          width={30}
          height={30}
          alt="web icon"
          onClick={() => router.push("/")}
          className="object-cover"
        />
        <span className="w-10" />
        <p className="nav-item" onClick={() => router.push("/home")}>
          Home
        </p>
      </div>
      <div className="flex flex-row mx-5">
        {!isEmpty(projectOptions) && (
          <Dropdown
            menu={{ items: projectOptions, onClick: onSelectProject }}
            trigger={["click"]}
          >
            <a onClick={(e) => e.preventDefault()}>
              <div
                id="type"
                className={`flex flex-row items-center button h-full`}
              >
                <p>{curProject?.name ?? "Select Project"}</p>
                <span className="w-3" />
                <FontAwesomeIcon icon={faChevronDown} size="sm" />
              </div>
            </a>
          </Dropdown>
        )}
        <span className="w-5" />
        {user ? (
          <Dropdown
            menu={{ items: profileOptions, onClick: onSelectProfile }}
            trigger={["click"]}
          >
            <div className="flex-1 flex flex-row items-center button">
              {user.image ? (
                <Image
                  src={user.image}
                  width={24}
                  height={24}
                  alt="profile picture"
                  className="rounded-full object-cover"
                />
              ) : (
                <FontAwesomeIcon icon={faCircleUser} size="2xl" color="gray" />
              )}
              <span className="w-2" />
              <p>{user.name}</p>
            </div>
          </Dropdown>
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
