import { Screen } from "@/components/Screen";
import { formatDate, formateRuntime, jsonParse } from "@/util/format";
import { prisma } from "server/db/client";
import { Dropdown, MenuProps, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { Button } from "@/components/Button";
import {
  faChartSimple,
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { Config, DashboardView } from "@prisma/client";
import { colors } from "@/util/color";
import { useRouter } from "next/router";
import {
  capitalize,
  filter,
  find,
  get,
  head,
  includes,
  last,
  map,
  orderBy,
  size,
  toLower,
  toUpper,
} from "lodash";
import { PieChart } from "react-minimal-pie-chart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
  const { project } = props;
  const router = useRouter();
  const projectId = parseInt(router.query.id as string);
  const { githubOwner, githubProject, dashboardView } =
    project.config as Config;
  const isGitConfigured = githubOwner && githubProject;

  const [log, setLog] = useState<any>();
  const [buildData, setBuildData] = useState<any>();
  const [view, setView] = useState<string>(dashboardView);

  useEffect(() => {
    view === DashboardView.TEST && getTestLog();
    view === DashboardView.GITHUB_ACITON && getGitLog({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getGitLog = async (item: any) => {
    const res = await fetch(
      `https://api.github.com/repos/${githubOwner}/${githubProject}/actions/runs`,
      { method: "GET" }
    );
    if (res.ok) {
      const logData = map(get(await res.json(), "workflow_runs"), (o) => {
        return {
          id: o.id,
          name: o.name,
          duration: formateRuntime(o.updated_at, o.run_started_at),
          updatedAt: o.run_started_at,
          status: o.conclusion,
          jobsUrl: o.jobs_url,
        };
      });
      setLog(logData);
      getGitRun({ url: head(logData)?.jobsUrl });
    } else {
      alert("Failed to generate results.");
    }
  };

  const getGitRun = async (item: any) => {
    const res = await fetch(item?.url, { method: "GET" });
    if (res.ok) {
      const resData = await res.json();
      setBuildData(head(resData?.jobs));
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
            updatedAt: o.updatedAt,
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
        render: (text: any) => formatDate(text),
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (value) => {
          return (
            <p style={{ color: get(colors, toLower(value)) }}>
              {capitalize(value)}
            </p>
          );
        },
      },
    ],
    (o) =>
      dashboardView === "GITHUB_ACITON"
        ? o.key !== "code"
        : o.key !== "duration"
  );

  const viewOptions: MenuProps["items"] = [
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

  const renderTestView = () => {
    const logByUpdatedAt = orderBy(log, ["updatedAt"], ["asc"]);
    const latest = last(logByUpdatedAt);
    const oldest = head(logByUpdatedAt);
    const sizeOfTests = size(log);
    const sizeOfPass =
      size(filter(log, (item) => includes(toUpper(item.status), "PASS"))) /
      sizeOfTests;
    const sizeOfFail =
      size(filter(log, (item) => includes(toUpper(item.status), "FAIL"))) /
      sizeOfTests;
    const sizeOfPending =
      size(filter(log, (item) => includes(toUpper(item.status), "PENDING"))) /
      sizeOfTests;

    const pieData = [
      { title: "Passed", value: sizeOfPass, color: colors.success },
      { title: "Fail", value: sizeOfFail, color: colors.failed },
      { title: "Pending", value: sizeOfPending, color: colors.pending },
    ];

    return (
      <div className="flex flex-row">
        <PieChart data={pieData} className="w-56" />
        <div className="ml-5">
          <p className="font-bold">Test Case Dates</p>
          <div className="flex flex-row">
            <div>
              <p>Latest - {latest?.code}</p>
              <p>{formatDate(latest?.updatedAt)}</p>
            </div>
            <span className="w-5" />
            <div>
              <p>Oldest - {oldest?.code}</p>
              <p>{formatDate(oldest?.updatedAt)}</p>
            </div>
          </div>
          <div className="flex flex-row my-3">
            <div>
              <p className="font-bold">Latest Results</p>
              <div>
                {map(pieData, (data, key) => {
                  return (
                    <div className="flex flex-row my-2 items-center" key={key}>
                      <div
                        className="w-2 h-2 rounded-full mr-2"
                        style={{ backgroundColor: data.color }}
                      />
                      <p className="flex flex-1 mr-2">{data.title}:</p>
                      <p>{data.value * 100}%</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <span className="w-5" />
            <div>
              <p>No. of tests</p>
              {map(pieData, (data, key) => {
                return (
                  <p className="text-center my-2" key={key}>
                    {size(
                      filter(log, (item) =>
                        includes(toUpper(item.status), toUpper(data.title))
                      )
                    )}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderGitHubView = () => {
    const { workflow_name, started_at, completed_at, conclusion, steps } =
      buildData || {};
    return (
      <div className="">
        <p className="font-bold">Latest Build</p>
        <div className="flex flex-row">
          <div className="flex flex-col">
            <div className="my-1">
              <p className="text-fade text-xs">Name</p>
              <p>{workflow_name}</p>
            </div>
            <div className="my-1">
              <p className="text-fade text-xs">Duration</p>
              <p>{formateRuntime(completed_at, started_at)}</p>
            </div>
            <div className="my-1">
              <p className="text-fade text-xs">Completed At</p>
              <p>{formatDate(completed_at)}</p>
            </div>
            <div>
              <p className="text-fade text-xs">Status</p>
              <p style={{ color: get(colors, toLower(conclusion)) }}>
                {conclusion}
              </p>
            </div>
          </div>
          <span className="w-10" />
          <div>
            <p className="text-fade text-xs">Steps</p>
            {map(steps, (step, key) => {
              return (
                <div className="flex flex-row items-center" key={key}>
                  <FontAwesomeIcon
                    icon={
                      step.conclusion === "success"
                        ? faCircleCheck
                        : faCircleXmark
                    }
                    color={get(colors, toLower(step.conclusion))}
                  />
                  <span className="w-3" />
                  <p>{step.name}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

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
          <p className="text-xl font-bold mb-3">Overview</p>
          {view !== DashboardView.GITHUB_ACITON && renderTestView()}
          {view === DashboardView.GITHUB_ACITON && renderGitHubView()}
          <p className="text-xl font-bold my-3">Log</p>
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
