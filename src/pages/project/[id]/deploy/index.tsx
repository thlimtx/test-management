import { Screen } from "@/components/Screen";
import { jsonParse } from "@/util/format";
import { useRouter } from "next/router";
import { prisma } from "server/db/client";
import { Table } from "antd";
import { Details } from "@/components/Details";
import { useForm } from "react-hook-form";
import { deployFields, deployLogColumns } from "./data";
import { useState } from "react";
import { getPermission } from "@/permission/data";

const Deploy = (props: any) => {
  const { deploy, deployLog } = props;
  const { id } = deploy;

  const router = useRouter();
  const { register, handleSubmit } = useForm();

  // TODO: login session
  const editPermission = getPermission({
    action: "edit",
    role: ["OWNER"],
    route: "deploy",
  });

  const [isEditing, setIsEditing] = useState(false);

  const updateProjectDetails = async (item: any) => {
    const res = await fetch("../../api/deploy/update", {
      method: "POST",
      body: JSON.stringify({ ...item }),
    });
    if (res.ok) {
      setIsEditing(false);
      router.replace(router.asPath);
    } else {
      alert("Failed to update deploy details");
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
        title="Deploy"
        onPressCancel={onPressCancel}
        onPressEdit={onPressEdit}
        onPressSave={handleSubmit(onSubmit)}
        data={deploy}
        fields={[
          ...deployFields,
          {
            render: ({}) => {
              return (
                <div className="">
                  <p className="text-lg font-bold my-3">Deploy Log</p>

                  <Table
                    columns={[...deployLogColumns]}
                    dataSource={deployLog}
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
  const deploy = await prisma.deploy.findFirst({
    where: { projectId: { equals: parseInt(id) } },
  });
  const deployLog =
    deploy &&
    (await prisma.deployLog.findMany({
      where: { deployId: { equals: deploy.id } },
    }));
  return {
    props: {
      deploy: jsonParse(deploy),
      deployLog: jsonParse(deployLog),
    },
  };
};

export default Deploy;
