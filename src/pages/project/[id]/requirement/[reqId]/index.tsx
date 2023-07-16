import { Details } from "@/components/Details";
import { Screen } from "@/components/Screen";
import { getPermission } from "@/permission/data";
import { formatDate, jsonParse } from "@/util/format";
import { replace } from "lodash";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { prisma } from "server/db/client";
import { getServerSession } from "next-auth";
import authOptions from "@/pages/api/auth/[...nextauth]";

const Requirements = (props: any) => {
  const { requirement, user } = props;
  const data = {
    ...requirement,
    createdAt: formatDate(requirement?.createdAt),
  };
  const router = useRouter();
  const projectId = parseInt(`${router.query.id}`);

  const editPermission = getPermission({
    action: "edit",
    route: "requirement",
    projectId,
    user,
  });

  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, setValue } = useForm();

  const updateRequirement = async (item: any) => {
    const res = await fetch("../../../api/requirement/update", {
      method: "POST",
      body: JSON.stringify({ ...item }),
    });
    if (res.ok) {
      setIsEditing(false);
      router.replace(router.asPath);
    } else {
      alert("Failed to update requirement");
    }
  };

  const onPressBack = () =>
    router.push(
      replace(router.asPath, `requirement/${requirement?.id}`, "requirement")
    );
  const onPressCancel = () => setIsEditing(false);
  const onPressEdit = () => setIsEditing(true);

  const onSubmit = (data: any) =>
    updateRequirement({ id: requirement?.id, ...data });

  return (
    <Screen sidebar>
      <Details
        isEditing={isEditing}
        editable={editPermission}
        register={register}
        title="Requirements"
        onPressBack={onPressBack}
        onPressCancel={onPressCancel}
        onPressEdit={onPressEdit}
        onPressSave={handleSubmit(onSubmit)}
        data={data}
        fields={[
          {
            render: ({ renderDetails }) => {
              return (
                <div className="flex flex-row justify-between">
                  {renderDetails({
                    id: "title",
                    title: "Title",
                    placeholder: "Enter Title",
                  })}
                  <div className="flex flex-1" />
                  {renderDetails({
                    id: "code",
                    title: "Requirement Code",
                    placeholder: "Enter Requirement Code",
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
            id: "createdAt",
            title: "Created At",
            editable: false,
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

  const { reqId } = context.query;
  const requirement = await prisma.requirement.findFirst({
    where: { id: { equals: parseInt(reqId) } },
  });
  return {
    props: {
      requirement: jsonParse(requirement),
      user: jsonParse(user),
    },
  };
};

export default Requirements;
