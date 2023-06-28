import { Button } from "@/components/Button";
import { Screen } from "@/components/Screen";
import { Sidebar } from "@/components/Sidebar";
import { TextInput } from "@/components/TextInput";
import { formatDate, jsonParse } from "@/util/format";
import { useRouter } from "next/router";
import { prisma } from "server/db/client";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { capitalize, get, toLower } from "lodash";
import { colors } from "@/util/color";

const TestPlans = (props: any) => {
  const { testPlans } = props;
  const router = useRouter();
  const projectId = router.query.id;
  // todo: Login session
  const userId = 1;

  const deleteTestPlan = async (item: any) => {
    const res = await fetch("../../api/test-plan/delete", {
      method: "POST",
      body: JSON.stringify({ ...item }),
    });
    if (res.ok) {
      router.replace(router.asPath);
    } else {
      alert("Failed to delete test plan");
    }
  };

  // todo: search
  const onSearch = (search: string) => {};

  const onPressDelete = (id: any) => {
    deleteTestPlan({ id });
  };

  const onPressAddTestPlan = () => {
    router.push(`/project/${projectId}/test-plan/create`);
  };

  const columns: ColumnsType<any> = [
    {
      title: "Code",
      key: "testPlanCode",
      render: (value) => (
        <a href={`/project/${projectId}/test-plan/${value.id}`}>
          {value.testPlanCode}
        </a>
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Last Executed",
      dataIndex: "lastExecutedAt",
      key: "lastExecutedAt",
      render: (value) => formatDate(value),
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
    // TODO: handle delete
    // {
    //   title: "Action",
    //   key: "action",
    //   render: (_, record) => {
    //     return (
    //       <FontAwesomeIcon
    //         className="button self-center"
    //         style={{ color: "red" }}
    //         onClick={() => onPressDelete(record.id)}
    //         icon={faXmark}
    //       />
    //     );
    //   },
    //   width: 50,
    // },
  ];

  return (
    <Screen>
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 py-3 px-5">
          <p className="text-2xl font-bold italic mb-5">Test Plans</p>
          <div className="p-4 my-2 bg-primaryBg shadow">
            <div className="flex flex-row justify-between items-center">
              <Button
                type="invert"
                text="Add"
                className="border-textPrimary"
                textClassName="text-textPrimary"
                onPress={onPressAddTestPlan}
              />
              <div>
                <TextInput
                  placeholder="Search"
                  onChange={(text) => onSearch(`${text}`)}
                />
              </div>
            </div>
            <Table
              columns={columns}
              dataSource={testPlans}
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
  const testPlans = await prisma.testPlan.findMany({
    where: { projectId: { equals: parseInt(id) } },
  });
  return {
    props: {
      testPlans: jsonParse(testPlans),
    },
  };
};

export default TestPlans;
