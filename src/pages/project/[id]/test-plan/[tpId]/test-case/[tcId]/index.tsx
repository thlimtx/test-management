import { Details } from "@/components/Details";
import { Screen } from "@/components/Screen";
import { formatDate, jsonParse } from "@/util/format";
import { capitalize, get, map, replace, toLower } from "lodash";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { prisma } from "server/db/client";
import { testCaseDropFields, testCaseFields1, testCaseFields2 } from "./data";
import { getPermission } from "@/permission/data";
import { RenderProps } from "@/components/Details/props";
import { colors } from "@/util/color";
import { FormDropdown } from "@/components/FormDropdown";
import { getServerSession } from "next-auth";
import authOptions from "@/pages/api/auth/[...nextauth]";

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

  const testCaseFields = [
    ...testCaseFields1,
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
    ...testCaseFields2,
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
