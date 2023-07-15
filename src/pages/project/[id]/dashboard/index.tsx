import { Screen } from "@/components/Screen";
import { formatDate, formateRuntime, jsonParse } from "@/util/format";
import { prisma } from "server/db/client";
import { Dropdown, MenuProps, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { Button } from "@/components/Button";
import { faChartSimple, faGear } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { Config, DashboardView } from "@prisma/client";
import { getDropdownOptionsbyType } from "@/util/data";
import { colors } from "@/util/color";
import { useRouter } from "next/router";
import { filter, find, get, map, remove } from "lodash";

const columns: ColumnsType<any> = [
  {
    title: "ID",
    key: "id",
    dataIndex: "id",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Last Executed",
    dataIndex: "lastExecuted",
    key: "lastExecuted",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
];

const Dashboard = (props: any) => {
  const { testResults, project } = props;
  const router = useRouter();
  const projectId = parseInt(router.query.id as string);
  const { githubOwner, githubProject, dashboardView } =
    project.config as Config;
  const isGitConfigured = githubOwner && githubProject;

  const [log, setLog] = useState<any>();
  const [view, setView] = useState<string>(dashboardView);

  useEffect(() => {
    view === DashboardView.TEST && getTestLog();
    view === DashboardView.GITHUB_ACITON && getGitLog({});
    view === DashboardView.ALL && getTestLog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getGitLog = async (item: any) => {
    const res = await fetch(
      `https://api.github.com/repos/${githubOwner}/${githubProject}/actions/runs`,
      { method: "GET" }
    );
    if (res.ok) {
      setLog(
        map(get(await res.json(), "workflow_runs"), (o) => {
          return {
            id: o.id,
            name: o.name,
            duration: formateRuntime(o.updated_at, o.run_started_at),
            updatedAt: formatDate(o.run_started_at),
            status: o.conclusion,
          };
        })
      );
    } else {
      alert("Failed to generate results.");
    }
  };

  const getTestLog = async () => {
    const res = await fetch("../../api/test-case/find", {
      method: "POST",
      body: JSON.stringify({ projectId }),
    });
    if (res.ok) {
      setLog(
        map(await res.json(), (o) => {
          return {
            id: o.id,
            code: o.code,
            name: o.title,
            updatedAt: formatDate(o.updatedAt),
            status: o.status,
          };
        })
      );
    } else {
      alert("Failed to get test logs.");
    }
  };

  const updateConfig = async (item: any) => {
    const res = await fetch("../../api/config/update", {
      method: "POST",
      body: JSON.stringify({ ...item }),
    });
    if (res.ok) {
      router.replace(router.asPath);
    } else {
      alert("Failed to update configuration.");
    }
  };

  const onSelectView: MenuProps["onClick"] = ({ key }) => {
    setView(key);
    updateConfig({ projectId, dashboardView: key });
    key === DashboardView.TEST && getTestLog();
    key === DashboardView.GITHUB_ACITON && getGitLog({});
  };

  const columns: ColumnsType<any> = filter(
    [
      {
        title: "Code",
        key: "code",
        dataIndex: "code",
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Duration",
        dataIndex: "duration",
        key: "duration",
      },
      {
        title: "Last Updated",
        dataIndex: "updatedAt",
        key: "updatedAt",
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
      },
    ],
    (o) =>
      dashboardView === "GITHUB_ACITON"
        ? o.key !== "code"
        : o.key !== "duration"
  );

  const viewOptions: MenuProps["items"] = [
    {
      key: DashboardView.ALL,
      label: "Build, Test, and Deploy",
    },
    {
      key: DashboardView.TEST,
      label: "Test",
    },
    {
      key: DashboardView.GITHUB_ACITON,
      label: isGitConfigured ? (
        "GitHub Actions"
      ) : (
        <div>
          <p>GitHub Actions</p>
          <p style={{ color: colors.failed, opacity: 0.5 }}>
            Setup GitHub configurations in project details.
          </p>
        </div>
      ),
      disabled: !isGitConfigured,
    },
  ];

  return (
    <Screen sidebar>
      <div className="flex-1 py-3 px-5">
        <div className="flex flex-row justify-between items-center mb-3">
          <p className="text-2xl font-bold italic">Dashboard</p>

          <Dropdown
            menu={{
              items: viewOptions,
              onClick: onSelectView,
            }}
            trigger={["click"]}
          >
            <a onClick={(e) => e.preventDefault()}>
              <Button
                text={
                  get(
                    find(viewOptions, (o) => o?.key === view),
                    "label"
                  ) || "Select Data to view"
                }
                className="ml-3 border-textPrimary"
                icon={faChartSimple}
                type="invert"
                textClassName="text-textPrimary"
              />
            </a>
          </Dropdown>
        </div>
        <div className="p-4 my-2 bg-primaryBg shadow">
          <p className="text-xl font-bold">Overview</p>
          <p className="text-xl font-bold">Log</p>
          <Table
            columns={columns}
            dataSource={log}
            rowKey={(data) => `${data.id}`}
          />
        </div>
      </div>
    </Screen>
  );
};

export const getServerSideProps = async (context: any) => {
  const { id } = context.query;

  const project = await prisma.project.findFirst({
    where: { id: { equals: parseInt(id) } },
    include: { config: true },
  });
  const testResults = await prisma.testResult.findMany({
    where: { projectId: { equals: parseInt(id) } },
  });
  return {
    props: {
      project: jsonParse(project),
      testResults: jsonParse(testResults),
    },
  };
};

export default Dashboard;
