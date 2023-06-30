import { Details } from "@/components/Details";
import { Screen } from "@/components/Screen";
import { formatDate, jsonParse } from "@/util/format";
import { replace } from "lodash";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { prisma } from "server/db/client";
import { testCaseFields } from "./data";
import { getPermission } from "@/permission/data";

const TestCase = (props: any) => {
  const { testCase } = props;
  const data = {
    ...testCase,
    createdAt: formatDate(testCase?.createdAt),
  };

  const router = useRouter();

  const { id, testPlanId } = data;
  // todo: Login session
  const userId = 1;
  const editPermission = getPermission({
    action: "edit",
    role: ["OWNER"],
    route: "test-case",
  });
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit } = useForm();

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

  // TODO: search
  const onSearch = (data: any) => {};
  const onSubmit = (data: any) => {
    updateTestCase({ id, ...data });
  };

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
  // todo: Login session
  const { tcId } = context.query;
  const testCase = await prisma.testCase.findFirst({
    where: { id: { equals: parseInt(tcId) } },
  });
  return {
    props: {
      testCase: jsonParse(testCase),
    },
  };
};

export default TestCase;
