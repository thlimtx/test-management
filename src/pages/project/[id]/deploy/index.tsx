import { Screen } from "@/components/Screen";
import { formatDate, formatDuration, jsonParse } from "@/util/format";
import { useRouter } from "next/router";
import { prisma } from "server/db/client";
import { Table } from "antd";
import { Details } from "@/components/Details";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { getPermission } from "@/permission/data";
import { getServerSession } from "next-auth";
import authOptions from "@/pages/api/auth/[...nextauth]";
import { ColumnsType } from "antd/es/table";
import { capitalize, find, get, isArray, toLower } from "lodash";
import { colors } from "@/util/color";
import moment from "moment";

const deployLogColumns: ColumnsType<any> = [
  {
    title: "ID",
    key: "id",
    dataIndex: "uid",
  },
  {
    title: "Duration (s)",
    key: "duration",
    render: (value) => {
      return (
        formatDuration(moment(value.ready).diff(value.buildingAt))
          .split(".")[0]
          .replace(":", "m") + "s"
      );
    },
  },
  {
    title: "Date",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (value) => formatDate(value),
  },
  {
    title: "Status",
    key: "status",
    render: (value) => {
      return (
        <p style={{ color: get(colors, toLower(value.state)) }}>
          {capitalize(value.state)}
        </p>
      );
    },
  },
];

const Deploy = (props: any) => {
  const { deploy, user } = props;
  const { id, projectId } = deploy ?? {};

  const router = useRouter();
  const { register, handleSubmit, setValue } = useForm();

  const editPermission = getPermission({
    action: "edit",
    route: "deploy",
    projectId,
    user,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [deployLogs, setDeployLogs] = useState<any>();

  useEffect(() => {
    getDeploymentLog({ projectId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const getDeploymentLog = async (item: any) => {
    const res = await fetch("/api/deploy/log", {
      method: "POST",
      body: JSON.stringify({ projectId, ...item }),
    });
    if (res.ok) {
      setDeployLogs(await res.json());
    } else {
      alert("Failed to get deployment log");
    }
  };

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
          {
            id: "description",
            title: "Description",
            placeholder: "Enter Description",
            multiline: true,
            onChange: (e) => setValue("description", e.currentTarget.value),
          },
          {
            id: "token",
            title: "Token",
            placeholder: "Enter token",
            type: "password",
            render: ({ renderDetails }) =>
              renderDetails({
                id: "token",
                title: "Token",
                placeholder: "Enter token",
                type: "password",
                renderText: (text) => (
                  <input
                    className="bg-primaryBg"
                    type="password"
                    value={text}
                    disabled
                  />
                ),
              }),
          },
          {
            id: "runEndpoint",
            title: "Deploy Endpoint",
            placeholder: "Enter deployment endpoint",
          },
          {
            id: "getEndpoint",
            title: "Deployment Log Endpoint",
            placeholder: "Enter deployment log endpoint",
          },
          {
            render: ({}) => {
              return (
                <div className="">
                  <p className="text-lg font-bold my-3">Deploy Log</p>

                  <Table
                    columns={[...deployLogColumns]}
                    dataSource={
                      // Vercel directory
                      deployLogs?.deployments ??
                      (find(deployLogs, (value) =>
                        isArray(value)
                      ) as Array<any>) ??
                      []
                    }
                    pagination={{ pageSize: 10 }}
                    rowKey={(data) => `${data.uid}`}
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
  const deploy = await prisma.deploy.findFirst({
    where: { projectId: { equals: parseInt(id) } },
  });
  // const deployLog =
  //   deploy &&
  //   (await prisma.deployLog.findMany({
  //     where: { deployId: { equals: deploy.id } },
  //   }));
  return {
    props: {
      deploy: jsonParse(deploy),
      // deployLog: jsonParse(deployLog),
      user: jsonParse(user),
    },
  };
};

export default Deploy;
