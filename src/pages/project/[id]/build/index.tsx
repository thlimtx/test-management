import { Screen } from "@/components/Screen";
import { jsonParse } from "@/util/format";
import { useRouter } from "next/router";
import { prisma } from "server/db/client";
import { Table } from "antd";
import { Details } from "@/components/Details";
import { useForm } from "react-hook-form";
import { buildFields, buildLogColumns } from "./data";
import { useState } from "react";
import { getPermission } from "@/permission/data";
import { getServerSession } from "next-auth";
import authOptions from "@/pages/api/auth/[...nextauth]";

const Build = (props: any) => {
  const { build, buildLog, user } = props;
  const { id, projectId } = build ?? {};

  const router = useRouter();
  const { register, handleSubmit } = useForm();

  const editPermission = getPermission({
    action: "edit",
    route: "build",
    projectId,
    user,
  });

  const [isEditing, setIsEditing] = useState(false);

  const updateProjectDetails = async (item: any) => {
    const res = await fetch("../../api/build/update", {
      method: "POST",
      body: JSON.stringify({ ...item }),
    });
    if (res.ok) {
      setIsEditing(false);
      router.replace(router.asPath);
    } else {
      alert("Failed to update build details");
    }
  };

  // const onPressBack = () => router.back();
  const onPressCancel = () => setIsEditing(false);
  const onPressEdit = () => setIsEditing(true);
  const onSubmit = (data: any) => {
    updateProjectDetails({ id, ...data });
  };

  return (
    <Screen sidebar>
      <Details
        isEditing={isEditing}
        editable={editPermission}
        register={register}
        title="Build"
        onPressCancel={onPressCancel}
        onPressEdit={onPressEdit}
        onPressSave={handleSubmit(onSubmit)}
        data={build}
        fields={[
          ...buildFields,
          {
            render: ({}) => {
              return (
                <div className="">
                  <p className="text-lg font-bold my-3">Build Log</p>

                  <Table
                    columns={[...buildLogColumns]}
                    dataSource={buildLog}
                    rowKey={(data) => `${data.userId}`}
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
  const { id } = context.query;
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return { props: {} };
  }
  const user = await prisma.user.findFirst({
    where: { email: jsonParse(session).user.email },
    include: { member: true },
  });
  const build = await prisma.build.findFirst({
    where: { projectId: { equals: parseInt(id) } },
  });
  const buildLog =
    build &&
    (await prisma.buildLog.findMany({
      where: { buildId: { equals: build.id } },
    }));
  return {
    props: {
      build: jsonParse(build),
      buildLog: jsonParse(buildLog),
      user: jsonParse(user),
    },
  };
};

export default Build;
