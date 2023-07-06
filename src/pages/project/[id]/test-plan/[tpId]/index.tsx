import { Button } from "@/components/Button";
import { Details } from "@/components/Details";
import { Screen } from "@/components/Screen";
import { TextInput } from "@/components/TextInput";
import { formatDate, jsonParse } from "@/util/format";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { filter, includes, map, replace, toLower } from "lodash";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { prisma } from "server/db/client";
import { TestPlanFields, requirementsColumns, testCaseColumns } from "./data";
import { getPermission } from "@/permission/data";
import { getServerSession } from "next-auth";
import authOptions from "@/pages/api/auth/[...nextauth]";

const TestPlans = (props: any) => {
  const { testPlan, user } = props;
  const data = {
    ...testPlan,
    createdAt: formatDate(testPlan?.createdAt),
  };

  const router = useRouter();

  const { projectId, id, reference, testCase } = data;
  const editPermission = getPermission({
    action: "edit",
    route: "test-plan",
    projectId,
    user,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchReq, setSearchReq] = useState("");
  const [searchTC, setSearchTC] = useState("");
  const { register, handleSubmit } = useForm();

  const testCases = filter(
    testCase,
    (item) =>
      includes(toLower(item.code), toLower(searchTC)) ||
      includes(toLower(item.title), toLower(searchTC))
  );
  const reqs = map(reference, (item) => item.req);
  const requirements = filter(
    reqs,
    (item) =>
      includes(toLower(item.code), toLower(searchReq)) ||
      includes(toLower(item.title), toLower(searchReq))
  );

  // TODO: delete test case
  const updateTestPlan = async (item: any) => {
    const res = await fetch("../../../api/test-plan/update", {
      method: "POST",
      body: JSON.stringify({ ...item }),
    });
    if (res.ok) {
      setIsEditing(false);
      router.replace(router.asPath);
    } else {
      alert("Failed to update test plan");
    }
  };
  const removeReference = async (item: any) => {
    const res = await fetch("../../../api/reference/delete", {
      method: "POST",
      body: JSON.stringify({ ...item, testPlanId: parseInt(`${id}`) }),
    });
    if (res.ok) {
      router.replace(router.asPath);
    } else {
      alert("Failed to remove reference");
    }
  };

  const onPressBack = () => router.push(replace(router.asPath, id, ""));
  const onPressCancel = () => setIsEditing(false);
  const onPressEdit = () => setIsEditing(true);

  const onPressAddRequirement = () =>
    router.push(router.asPath + "/requirement");

  const onPressAddTestCase = () =>
    router.push(router.asPath + "/test-case/create");
  const onSearchReq = (text: string) => setSearchReq(text);
  const onSearchTC = (text: string) => setSearchTC(text);
  const onSubmit = (data: any) => updateTestPlan({ id, ...data });

  const onPressRemove = (id: any) => {
    removeReference({ reqId: id });
  };

  const columns: ColumnsType<any> = [
    ...requirementsColumns,
    editPermission
      ? {
          title: "Action",
          key: "action",
          render: (_, record) => {
            return (
              <FontAwesomeIcon
                className="button self-center"
                style={{ color: "red" }}
                onClick={() => onPressRemove(record.id)}
                icon={faXmark}
              />
            );
          },
          width: 50,
        }
      : {},
  ];

  return (
    <Screen sidebar>
      <Details
        isEditing={isEditing}
        editable={editPermission}
        register={register}
        title="Test Plans"
        onPressBack={onPressBack}
        onPressCancel={onPressCancel}
        onPressEdit={onPressEdit}
        onPressSave={handleSubmit(onSubmit)}
        data={data}
        fields={[
          ...TestPlanFields,
          {
            render: ({}) => {
              return (
                <div className="">
                  <p className="text-lg font-bold my-3">Requirements</p>
                  <div className="flex flex-row justify-between items-center">
                    {editPermission ? (
                      <Button
                        type="invert"
                        text="Add"
                        className="border-textPrimary"
                        textClassName="text-textPrimary"
                        icon={faPlus}
                        onPress={onPressAddRequirement}
                      />
                    ) : (
                      <div />
                    )}
                    <div>
                      <TextInput
                        placeholder="Search"
                        onChange={(e) => onSearchReq(e.currentTarget.value)}
                      />
                    </div>
                  </div>
                  <Table
                    columns={[
                      {
                        title: "Code",
                        key: "code",
                        width: 50,
                        render: (value) => (
                          <a
                            href={`/project/${projectId}/requirement/${value.id}`}
                          >
                            {value.code}
                          </a>
                        ),
                      },
                      ...columns,
                    ]}
                    dataSource={requirements}
                    rowKey={(data) => `${data.id}`}
                  />
                </div>
              );
            },
          },
          {
            render: ({}) => {
              return (
                <div className="">
                  <p className="text-lg font-bold my-3">Test Case</p>
                  <div className="flex flex-row justify-between items-center">
                    {editPermission ? (
                      <Button
                        type="invert"
                        text="Add"
                        className="border-textPrimary"
                        textClassName="text-textPrimary"
                        icon={faPlus}
                        onPress={onPressAddTestCase}
                      />
                    ) : (
                      <div />
                    )}
                    <div>
                      <TextInput
                        placeholder="Search"
                        onChange={(e) => onSearchTC(e.currentTarget.value)}
                      />
                    </div>
                  </div>
                  <Table
                    columns={[
                      {
                        title: "Code",
                        key: "code",
                        width: 50,
                        render: (value) => (
                          <a
                            href={`/project/${projectId}/test-plan/${id}/test-case/${value.id}`}
                          >
                            {value.code}
                          </a>
                        ),
                      },
                      ...testCaseColumns,
                    ]}
                    dataSource={testCases}
                    rowKey={(data) => `${data.id}`}
                  />
                </div>
              );
            },
          },
        ]}
      />
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
  const { tpId } = context.query;
  const testPlan = await prisma.testPlan.findFirst({
    where: { id: { equals: parseInt(tpId) } },
    include: {
      reference: {
        include: {
          req: true,
        },
      },
      testCase: true,
    },
  });
  return {
    props: {
      testPlan: jsonParse(testPlan),
      user: jsonParse(user),
    },
  };
};

export default TestPlans;
