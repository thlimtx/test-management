import { Button } from "@/components/Button";
import { Screen } from "@/components/Screen";
import { TextInput } from "@/components/TextInput";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { faFloppyDisk, faXmark } from "@fortawesome/free-solid-svg-icons";
import { replace } from "lodash";
import { MenuProps } from "antd";
import { getDropdownOptionsbyType } from "@/util/data";
import { TestPriority, TestStatus, TestType } from "@prisma/client";
import { getPermission } from "@/permission/data";
import { FormDropdown } from "@/components/FormDropdown";
import { jsonParse } from "@/util/format";
import { prisma } from "server/db/client";
import { getServerSession } from "next-auth";
import authOptions from "@/pages/api/auth/[...nextauth]";

const CreateTestCase = (props: any) => {
  const { user } = props;
  const router = useRouter();
  const { register, handleSubmit, watch, setValue } = useForm();
  const tpId = parseInt(router.query.tpId as string);
  const projectId = parseInt(`${router.query.id}`);
  const editPermission = getPermission({
    action: "edit",
    route: "test-case",
    projectId,
    user,
  });

  const testCasePriorityOptions = getDropdownOptionsbyType(TestPriority);
  const testCaseStatusOptions = getDropdownOptionsbyType(TestStatus);
  const testCaseTypeOptions = getDropdownOptionsbyType(TestType);

  const createTestCase = async (item: any) => {
    const res = await fetch("../../../../../api/test-case/create", {
      method: "POST",
      body: JSON.stringify({ ...item, testPlanId: tpId }),
    });
    if (res.ok) {
      const createdTestCase = await res.json();
      router.push(replace(router.asPath, "create", createdTestCase?.id));
    } else {
      alert("Failed to create test case");
    }
  };

  const onPressCancel = () => router.back();
  const onSubmit = (data: any) => createTestCase(data);

  const renderDetails = (title: string, id: string) => {
    return (
      <div>
        <p className="text-fade text-xs">{title}</p>
        <TextInput
          id={id}
          register={register}
          registerOptions={{ required: true }}
          placeholder={`Enter ${title}`}
        />
      </div>
    );
  };

  const renderTextArea = (title: string, id: string) => {
    return (
      <div>
        <p className="text-fade text-xs mb-1.5">{title}</p>
        <textarea
          className="w-full border border-opacity-100 rounded-sm text-sm px-3 py-1.5"
          rows={5}
          id={id}
          placeholder={`Enter ${title}`}
          onChange={(e) => setValue(id, e.currentTarget.value)}
        />
      </div>
    );
  };

  const renderDropdown = (
    id: string,
    title: string,
    options: MenuProps["items"]
  ) => {
    const value = watch(id);
    const onSelect = (key: string, value?: string) => setValue(key, value);
    return (
      <FormDropdown {...{ register, id, title, options, value, onSelect }} />
    );
  };

  return (
    <Screen sidebar permission={editPermission}>
      <div className="flex-1 py-3 px-5">
        <div className="flex flex-row justify-between items-center">
          <p className="text-2xl font-bold italic mb-5">Test Cases</p>
          <div className="flex flex-row">
            <Button
              text="Cancel"
              className="mr-3 border-textPrimary"
              icon={faXmark}
              type="invert"
              textClassName="text-textPrimary"
              onPress={onPressCancel}
            />
            <Button
              text="Save"
              className="border-textPrimary"
              icon={faFloppyDisk}
              type="invert"
              textClassName="text-textPrimary"
              onPress={handleSubmit(onSubmit)}
            />
          </div>
        </div>
        <div className="p-4 my-2 bg-primaryBg shadow">
          <div className="flex flex-row">
            <div className="flex-1 mr-3">{renderDetails("Title", "title")}</div>
            {renderDetails("Test Case Code", "code")}
          </div>
          {renderTextArea("Description", "description")}
          <div className="flex flex-row justify-between">
            {renderDropdown("type", "Type", testCaseTypeOptions)}
            <span className="w-3" />
            {renderDropdown("priority", "Priority", testCasePriorityOptions)}
            <span className="w-3" />
            {renderDropdown("status", "Status", testCaseStatusOptions)}
          </div>
          {renderDetails("Precondition", "precondition")}
          {renderTextArea("Steps", "steps")}
          {renderTextArea("Test Data", "data")}
          {renderDetails("Expected result", "expected")}
          {renderDetails("Test Script", "script")}
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

export default CreateTestCase;
