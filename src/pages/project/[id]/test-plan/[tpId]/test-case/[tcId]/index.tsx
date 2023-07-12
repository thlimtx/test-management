import { Details } from "@/components/Details";
import { Screen } from "@/components/Screen";
import { formatDate, jsonParse } from "@/util/format";
import { capitalize, get, map, replace, toLower } from "lodash";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { prisma } from "server/db/client";
import { getPermission } from "@/permission/data";
import { FieldItem, RenderProps } from "@/components/Details/props";
import { colors } from "@/util/color";
import { FormDropdown } from "@/components/FormDropdown";
import { getServerSession } from "next-auth";
import authOptions from "@/pages/api/auth/[...nextauth]";
import { getDropdownOptionsbyType } from "@/util/data";
import { TestPriority, TestStatus, TestType } from "@prisma/client";

export const testCaseDropFields = [
  {
    id: "type",
    title: "Type",
    options: getDropdownOptionsbyType(TestType),
  },
  {
    id: "priority",
    title: "Priority",
    options: getDropdownOptionsbyType(TestPriority),
  },
  {
    id: "status",
    title: "Status",
    options: getDropdownOptionsbyType(TestStatus),
  },
];

const TestCase = (props: any) => {
  const { testCase, user } = props;
  const data = {
    ...testCase,
    createdAt: formatDate(testCase?.createdAt),
  };

  const router = useRouter();

  const projectId = parseInt(`${router.query.id}`);
  const { id } = data;
  const editPermission = getPermission({
    action: "edit",
    route: "test-case",
    projectId,
    user,
  });
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, watch, setValue } = useForm();

  const updateTestCase = async (item: any) => {
    const res = await fetch("../../../../../api/test-case/update", {
      method: "POST",
      body: JSON.stringify({ ...item }),
    });
    if (res.ok) {
      setIsEditing(false);
      router.replace(router.asPath);
    } else {
      alert("Failed to update test case");
    }
  };

  const onPressBack = () =>
    router.push(replace(router.asPath, `test-case/${id}`, ""));
  const onPressCancel = () => setIsEditing(false);
  const onPressEdit = () => setIsEditing(true);

  const onSubmit = (data: any) => {
    updateTestCase({ id, ...data });
  };

  const testCaseFields: FieldItem[] = [
    {
      render: ({ renderDetails }: RenderProps) => {
        return (
          <div className="flex flex-row">
            {renderDetails({
              id: "title",
              title: "Title",
              placeholder: "Enter Title",
            })}
            <div className="flex flex-1" />
            {renderDetails({
              id: "code",
              title: "Code",
              placeholder: "Enter Code",
            })}
          </div>
        );
      },
    },
    {
      id: "description",
      title: "Description",
      placeholder: "Enter Description",
      multiline: true,
      onChange: (e) => setValue("description", e.currentTarget.value),
    },
    {
      render: ({ renderDetails, data, isEditing }: RenderProps) => {
        const statusColor = get(colors, toLower(data.status));
        return isEditing ? (
          <div className="flex flex-row justify-between">
            {map(testCaseDropFields, (item) => {
              const { id, title, options } = item;
              const value = watch(id);
              const onSelect = (key: string, value?: string) =>
                setValue(key, value);
              console.log(data);

              return (
                <FormDropdown
                  {...{ register, id, title, options, value, onSelect }}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex flex-row">
            {renderDetails({
              id: "type",
              title: "Type",
              editable: false,
            })}
            {renderDetails({
              id: "priority",
              title: "Priority",
              editable: false,
            })}
            <div
              className={`flex flex-1 flex-col`}
              style={{ color: statusColor }}
            >
              {renderDetails({
                id: "status",
                title: "Status",
                editable: false,
                renderText: (text: any) => capitalize(text),
              })}
            </div>
          </div>
        );
      },
    },
    {
      render: ({ renderDetails }: RenderProps) => {
        return (
          <div className="flex flex-row justify-evenly">
            {renderDetails({
              id: "createdAt",
              title: "Created At",
              editable: false,
            })}
            {renderDetails({
              id: "lastExecutedAt",
              title: "Last Executed",
              placeholder: "Enter Last Executed Date",
              editable: false,
            })}
            <div className="flex flex-1"></div>
          </div>
        );
      },
    },
    {
      id: "precondition",
      title: "Precondition",
      placeholder: "Enter Precondition",
    },
    {
      id: "steps",
      title: "Steps",
      placeholder: "Enter Steps",
      multiline: true,
      onChange: (e) => setValue("steps", e.currentTarget.value),
    },
    {
      id: "data",
      title: "Data",
      placeholder: "Enter Test Data",
      multiline: true,
      onChange: (e) => setValue("data", e.currentTarget.value),
    },
    {
      id: "expected",
      title: "Expected Result",
      placeholder: "Enter Expected Result",
    },
    {
      id: "script",
      title: "Test Script",
      placeholder: "Enter Test Script",
    },
    {
      id: "result",
      title: "Actual Result",
      placeholder: "Enter Actual Result",
    },
  ];

  return (
    <Screen sidebar>
      <Details
        isEditing={isEditing}
        editable={editPermission}
        register={register}
        title="Test Case"
        onPressBack={onPressBack}
        onPressCancel={onPressCancel}
        onPressEdit={onPressEdit}
        onPressSave={handleSubmit(onSubmit)}
        data={data}
        fields={[...testCaseFields]}
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
  const { tcId } = context.query;
  const testCase = await prisma.testCase.findFirst({
    where: { id: { equals: parseInt(tcId) } },
  });
  return {
    props: {
      testCase: jsonParse(testCase),
      user: jsonParse(user),
    },
  };
};

export default TestCase;
