import { Button } from "@/components/Button";
import { Details } from "@/components/Details";
import { Screen } from "@/components/Screen";
import { Sidebar } from "@/components/Sidebar";
import { TextInput } from "@/components/TextInput";
import { formatDate, jsonParse } from "@/util/format";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { map, replace } from "lodash";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { prisma } from "server/db/client";
import { TestPlanFields, requirementsColumns, testCaseColumns } from "./data";

const TestPlans = (props: any) => {
  const { testPlan } = props;
  const data = {
    ...testPlan,
    createdAt: formatDate(testPlan?.createdAt),
  };

  const router = useRouter();

  const { projectId, id, reference, testCase } = data;
  // todo: Login session
  const userId = 1;
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit } = useForm();

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

  const onPressBack = () => router.push(replace(router.asPath, id, ""));
  const onPressCancel = () => setIsEditing(false);
  const onPressEdit = () => setIsEditing(true);

  // TODO: add reference
  const onPressAddRequirement = () =>
    router.push(router.asPath + "/requirement");

  // TODO: create test case
  const onPressAddTestCase = () => {};
  // TODO: search
  const onSearch = (data: any) => {};
  const onSubmit = (data: any) => updateTestPlan({ id, ...data });

  // TODO: remove reference
  const onPressRemove = (id: any) => {
    // removeRequirement({ id });
  };

  const columns: ColumnsType<any> = [
    ...requirementsColumns,
    {
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
    },
  ];

  return (
    <Screen>
      <div className="flex flex-1">
        <Sidebar />
        <Details
          isEditing={isEditing}
          editable
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
                      <Button
                        type="invert"
                        text="Add"
                        className="border-textPrimary"
                        textClassName="text-textPrimary"
                        icon={faPlus}
                        onPress={onPressAddRequirement}
                      />
                      <TextInput
                        placeholder="Search"
                        onChange={(text) => onSearch(`${text}`)}
                      />
                    </div>
                    <Table
                      columns={[
                        {
                          title: "Code",
                          key: "reqCode",
                          width: 50,
                          render: (value) => (
                            <a
                              href={`/project/${projectId}/requirement/${value.id}`}
                            >
                              {value.reqCode}
                            </a>
                          ),
                        },
                        ...columns,
                      ]}
                      dataSource={map(reference, (item) => item.req)}
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
                      <Button
                        type="invert"
                        text="Add"
                        className="border-textPrimary"
                        textClassName="text-textPrimary"
                        icon={faPlus}
                        onPress={onPressAddTestCase}
                      />
                      <TextInput
                        placeholder="Search"
                        onChange={(text) => onSearch(`${text}`)}
                      />
                    </div>
                    <Table
                      columns={[
                        {
                          title: "Code",
                          key: "testCaseCode",
                          width: 50,
                          render: (value) => (
                            <a
                              href={`/project/${projectId}/test-case/${value.id}`}
                            >
                              {value.testCaseCode}
                            </a>
                          ),
                        },
                        ...testCaseColumns,
                      ]}
                      dataSource={testCase}
                      rowKey={(data) => `${data.id}`}
                    />
                  </div>
                );
              },
            },
          ]}
        />
      </div>
    </Screen>
  );
};

export const getServerSideProps = async (context: any) => {
  // todo: Login session
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
    },
  };
};

export default TestPlans;
