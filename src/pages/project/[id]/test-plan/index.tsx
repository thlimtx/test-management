import { Button } from "@/components/Button";
import { Screen } from "@/components/Screen";
import { TextInput } from "@/components/TextInput";
import { formatDate, jsonParse } from "@/util/format";
import { useRouter } from "next/router";
import { prisma } from "server/db/client";
import { Modal, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { capitalize, debounce, get, map, toLower } from "lodash";
import { colors } from "@/util/color";
import { getPermission } from "@/permission/data";
import { useEffect, useState } from "react";
import { TestCase, TestPlan } from "@prisma/client";
import { getServerSession } from "next-auth";
import authOptions from "@/pages/api/auth/[...nextauth]";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const TestPlans = (props: any) => {
  const { user } = props;
  const router = useRouter();
  const projectId = parseInt(`${router.query.id}`);

  const editPermission = getPermission({
    action: "edit",
    route: "test-plan",
    projectId,
    user,
  });
  const [testPlans, setTestPlans] = useState<TestPlan[]>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteData, setDeleteData] = useState<
    TestPlan & { testCase: TestCase[] }
  >();

  useEffect(() => {
    getTestPlans({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

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

  const getTestPlans = async (item: any) => {
    const res = await fetch("../../api/test-plan/filter", {
      method: "POST",
      body: JSON.stringify({ projectId, ...item }),
    });
    if (res.ok) {
      setTestPlans(await res.json());
    } else {
      alert("Failed to get requirements");
    }
  };

  const onSearch = debounce((text) => {
    getTestPlans({ search: text });
  }, 150);

  const onPressDelete = (id: any) => {
    deleteTestPlan({ id });
    setIsModalOpen(false);
  };

  const onPressAddTestPlan = () => {
    router.push(`/project/${projectId}/test-plan/create`);
  };

  const columns: ColumnsType<any> = [
    {
      title: "Code",
      key: "code",
      render: (value) => (
        <a
          onClick={() =>
            router.push(`/project/${projectId}/test-plan/${value.id}`)
          }
        >
          {value.code}
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
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        return (
          <FontAwesomeIcon
            className="button self-center"
            style={{ color: "red" }}
            onClick={() => {
              setDeleteData(record);
              setIsModalOpen(true);
            }}
            icon={faXmark}
          />
        );
      },
      width: 50,
    },
  ];

  return (
    <Screen sidebar>
      <div className="flex-1 py-3 px-5">
        <p className="text-2xl font-bold italic mb-5">Test Plans</p>
        <div className="p-4 my-2 bg-primaryBg shadow">
          <div className="flex flex-row justify-between items-center">
            {editPermission ? (
              <Button
                type="invert"
                text="Add"
                className="border-textPrimary"
                textClassName="text-textPrimary"
                onPress={onPressAddTestPlan}
              />
            ) : (
              <div />
            )}
            <div>
              <TextInput
                placeholder="Search"
                onChange={(e) => onSearch(e.currentTarget.value)}
              />
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={testPlans}
            rowKey={(data) => `${data.id}`}
          />
          <Modal
            title={`Delete ${deleteData?.code} ${deleteData?.title}`}
            open={!!deleteData && isModalOpen}
            onOk={() => onPressDelete(deleteData?.id)}
            onCancel={() => setIsModalOpen(false)}
            okButtonProps={{
              style: { backgroundColor: "red" },
              className: "button",
            }}
          >
            <p>Are you sure?</p>
            <p>You will also be deleting:</p>
            {map(deleteData?.testCase, (item) => {
              return (
                <p>
                  {item.code} {item.title}
                </p>
              );
            })}
          </Modal>
        </div>
      </div>
    </Screen>
  );
};

export const getServerSideProps = async (context: any) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return { props: {} };
  }
  const user = await prisma.user.findFirst({
    where: { email: jsonParse(session).user.email },
    include: { member: true },
  });
  return {
    props: {
      user: jsonParse(user),
    },
  };
};

export default TestPlans;
