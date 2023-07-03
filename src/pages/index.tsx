import { Button } from "@/components/Button";
import { prisma } from "server/db/client";
import { Screen } from "@/components/Screen";
import { jsonParse } from "@/util/format";
import { Box } from "@/components/Box";
import { useRouter } from "next/router";
import {
  capitalize,
  debounce,
  filter,
  find,
  isEmpty,
  join,
  map,
  size,
  some,
} from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { TextInput } from "@/components/TextInput";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import moment from "moment";
import { useEffect, useState } from "react";
import { Member, Project } from "@prisma/client";

const Home = (props: any) => {
  const userId = 1;
  const router = useRouter();
  const { recentProjects, allProjects } = props;
  const [projects, setProjects] =
    useState<(Project & { members: Member[] })[]>(allProjects);

  const hasProject = !isEmpty(allProjects);
  const projectsOwned = filter(allProjects, (item) =>
    some(item.members, { userId, role: ["OWNER"] })
  );

  useEffect(() => {
    getProjects({});
  }, []);

  const columns: ColumnsType<any> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Version",
      dataIndex: "version",
      key: "version",
    },
    {
      title: "Tools",
      dataIndex: "tools",
      key: "tools",
    },
    {
      title: "Role",
      key: "role",
      render: (data: any) => {
        const curUser = find(data.members, (o) => {
          return o.userId === userId;
        });
        return join(
          map(curUser.role, (o) => capitalize(o)),
          ", "
        );
      },
    },
    {
      title: "Members",
      key: "members",
      render: (item) => {
        return size(item.members);
      },
    },
    {
      title: "Last Updated",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (item) => moment(item).format("DD/MM/YYYY"),
    },
  ];

  const getProjects = async (item: any) => {
    const res = await fetch("/api/project/filter", {
      method: "POST",
      body: JSON.stringify({ userId, ...item }),
    });
    if (res.ok) {
      setProjects(await res.json());
    } else {
      alert("Failed to get projects");
    }
  };

  const onSearch = debounce((text) => {
    getProjects({ search: text });
  }, 150);

  const onPressCreateProject = () => {
    router.push("/project/create");
  };

  const onPressProject = (id: any) => {
    router.push(`/project/${id}`);
  };

  return (
    <Screen>
      {hasProject ? (
        <div className="flex flex-1">
          {/** SIDEBAR */}
          <div className="sidebar-frame">
            <div className="sidebar bg-primaryBg p-5">
              <div className="flex flex-row justify-between my-2">
                <p className="font-bold">Projects Owned</p>
                <p>{size(projectsOwned)}</p>
              </div>
              <div className="flex flex-row justify-between my-2">
                <p className="font-bold">Total Projects</p>
                <p>{size(allProjects)}</p>
              </div>
            </div>
          </div>

          <div className="maincontent flex-1 py-5 px-10">
            <p className="text-2xl font-bold italic mb-5">Recent Changes</p>
            <div className="flex flex-row flex-wrap">
              {map(recentProjects, (item, index) => {
                return (
                  <div
                    key={index}
                    className="bg-primaryBg mr-6 mb-6 px-3 py-2 w-96 h-32 flex flex-col justify-between button"
                    onClick={() => onPressProject(item.id)}
                  >
                    <div className="flex flex-row items-center justify-between mb-1">
                      <p>{item.name}</p>
                      <div className="text-xs font-bold text-primaryBg bg-primary w-14 text-center py-0.5 rounded">
                        {capitalize(
                          find(item.members, (o) => o.userId === userId)
                            ?.role[0]
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-fade overflow-hidden flex flex-1">
                      {item.description}
                    </p>
                    <div className="flex flex-row items-center justify-between">
                      <p>{item.version}</p>
                      <div className="flex flex-row items-center">
                        <FontAwesomeIcon
                          icon={faUser}
                          size="sm"
                          className="mr-1 text-fade"
                        />
                        {size(item.members)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-2xl font-bold italic mb-4">Projects</p>
            <div className="flex flex-row justify-between items-center">
              <Button
                type="invert"
                text="Start a project"
                className="border-textPrimary"
                textClassName="text-textPrimary"
                onPress={onPressCreateProject}
              />
              <div>
                <TextInput
                  placeholder="Search"
                  onChange={(e) => onSearch(e.currentTarget.value)}
                />
              </div>
            </div>
            <Table
              columns={columns}
              dataSource={projects}
              rowKey={(data) => `${data.id}`}
            />
          </div>
        </div>
      ) : (
        <Box>
          <div className="flex flex-1 flex-col justify-evenly text-center items-center">
            <p className="text-3xl italic font-bold">
              Welcome to the Test Management System
            </p>
            <p className="text-2xl italic ">
              You currently do not have any projects yet.
            </p>
            <Button
              className="rounded-full w-40 max-w-full py-3"
              text="Get Started"
              onPress={() => router.push("/project/create")}
            />
          </div>
        </Box>
      )}
    </Screen>
  );
};

export const getServerSideProps = async (context: any) => {
  const userId = 1;
  const recentProjects = await prisma.project.findMany({
    where: { members: { some: { userId } } },
    include: {
      members: true,
    },
    orderBy: { updatedAt: "desc" },
    take: 4,
  });
  const projects = await prisma.project.findMany({
    where: { members: { some: { userId } } },
    include: {
      members: true,
    },
    orderBy: { updatedAt: "desc" },
  });
  return {
    props: {
      recentProjects: jsonParse(recentProjects),
      allProjects: jsonParse(projects),
    },
  };
};

export default Home;
