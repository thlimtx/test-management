import { Screen } from "@/components/Screen";
import { Sidebar } from "@/components/Sidebar";
import { jsonParse } from "@/util/format";
import { useRouter } from "next/router";
import { prisma } from "server/db/client";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";

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
  const router = useRouter();
  const { testResults } = props;
  console.log(props);

  // todo: Login session
  const userId = 1;

  return (
    <Screen>
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 py-3 px-5">
          <p className="text-2xl font-bold italic mb-5">Dashboard</p>
          <div className="p-4 my-2 bg-primaryBg shadow">
            <p className="text-xl font-bold">Overview</p>
            <p className="text-xl font-bold">Log</p>
            <Table
              columns={columns}
              dataSource={testResults}
              rowKey={(data) => `${data.id}`}
            />
          </div>
        </div>
      </div>
    </Screen>
  );
};

export const getServerSideProps = async (context: any) => {
  // todo: Login session
  const { id } = context.query;
  const testResults = await prisma.testResult.findMany({
    where: { projectId: { equals: parseInt(id) } },
  });
  return {
    props: {
      testResults: jsonParse(testResults),
    },
  };
};

export default Dashboard;
