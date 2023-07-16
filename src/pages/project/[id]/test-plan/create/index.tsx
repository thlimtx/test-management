import { Button } from "@/components/Button";
import { Screen } from "@/components/Screen";
import { TextInput } from "@/components/TextInput";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { faFloppyDisk, faXmark } from "@fortawesome/free-solid-svg-icons";
import { replace } from "lodash";
import { getPermission } from "@/permission/data";
import { getServerSession } from "next-auth";
import authOptions from "@/pages/api/auth/[...nextauth]";
import { jsonParse } from "@/util/format";
import { prisma } from "server/db/client";

const CreateTestPlan = (props: any) => {
  const { user } = props;
  const router = useRouter();
  const { register, handleSubmit, setValue } = useForm();
  const projectId = parseInt(router.query.id as string);
  const editPermission = getPermission({
    action: "edit",
    route: "test-plan",
    projectId,
    user,
  });

  const createTestPlan = async (item: any) => {
    const res = await fetch("../../../api/test-plan/create", {
      method: "POST",
      body: JSON.stringify({ ...item, projectId }),
    });
    if (res.ok) {
      const createdTestPlan = await res.json();
      router.push(replace(router.asPath, "create", createdTestPlan?.id));
    } else {
      alert("Failed to create test plan");
    }
  };

  const onPressCancel = () => router.back();
  const onSubmit = (data: any) => createTestPlan(data);

  const renderDetails = (title: string, id: string, options?: any) => {
    return (
      <div>
        <p className="text-fade text-xs">{title}</p>
        <TextInput
          id={id}
          register={register}
          registerOptions={options ?? {}}
          placeholder={`Enter ${title}`}
        />
      </div>
    );
  };

  return (
    <Screen sidebar permission={editPermission}>
      <div className="flex-1 py-3 px-5">
        <div className="flex flex-row justify-between items-center">
          <p className="text-2xl font-bold italic mb-5">Test Plans</p>
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
          {renderDetails("Test Plan Code", "code", { required: true })}
          {renderDetails("Name", "title", { required: true })}
          <div>
            <p className="text-fade text-xs">Description</p>
            <textarea
              className="w-full border border-opacity-100 rounded-sm text-sm px-3 py-1.5 my-2"
              rows={5}
              id="description"
              placeholder="Enter Description"
              onChange={(e) => setValue("description", e.currentTarget.value)}
            />
          </div>
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

export default CreateTestPlan;
