import { Details } from "@/components/Details";
import { Screen } from "@/components/Screen";
import { jsonParse } from "@/util/format";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { prisma } from "server/db/client";
import { Button } from "@/components/Button";
import { TextInput } from "@/components/TextInput";
import { Table } from "antd";
import { getPermission } from "@/permission/data";
import { Member, User } from "@prisma/client";
import { capitalize, debounce, join, map } from "lodash";
import { getServerSession } from "next-auth";
import authOptions from "@/pages/api/auth/[...nextauth]";

const memberColumns = [
  {
    title: "Name",
    key: "name",
    render: (data: any) => data.user.name,
  },
  {
    title: "Email",
    key: "email",
    render: (data: any) => data.user.email,
  },
  {
    title: "Role",
    key: "role",
    render: (data: any) => {
      return join(
        map(data.role, (o) => capitalize(o)),
        ", "
      );
    },
  },
];

const ProjectDetails = (props: any) => {
  const { project, user } = props;
  const data = {
    ...project,
    githubOwner: project.config?.githubOwner,
    githubProject: project.config?.githubProject,
  };
  const projectId = project?.id;

  const router = useRouter();

  const { id } = data;
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, setValue, watch } = useForm();
  const [members, setMembers] = useState<(Member & { user: User })[]>();

  const editPermission = getPermission({
    action: "edit",
    route: "details",
    projectId,
    user,
  });

  useEffect(() => {
    getMembers({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getMembers = async (item: any) => {
    const res = await fetch("../../api/member/filter", {
      method: "POST",
      body: JSON.stringify({ ...item, projectId: id }),
    });
    if (res.ok) {
      setMembers(await res.json());
    } else {
      alert("Failed to get project members");
    }
  };

  const updateProjectDetails = async (item: any) => {
    const res = await fetch("../../api/project/update", {
      method: "POST",
      body: JSON.stringify({ ...item }),
    });
    if (res.ok) {
      setIsEditing(false);
      router.replace(router.asPath);
    } else {
      alert("Failed to update project details");
    }
  };

  const onPressBack = () => router.back();
  const onPressCancel = () => setIsEditing(false);
  const onPressEdit = () => setIsEditing(true);

  const onSearch = debounce((text) => {
    getMembers({ search: text });
  }, 150);

  const onPressAddMember = () => router.push(router.asPath + "/members");

  const onSubmit = (data: any) => {
    updateProjectDetails({ id, ...data });
  };

  return (
    <Screen sidebar>
      <Details
        isEditing={isEditing}
        editable={editPermission}
        register={register}
        title="Project Details"
        onPressBack={onPressBack}
        onPressCancel={onPressCancel}
        onPressEdit={onPressEdit}
        onPressSave={handleSubmit(onSubmit)}
        data={data}
        fields={[
          {
            id: "name",
            title: "Name",
            placeholder: "Enter Name",
          },
          {
            id: "description",
            title: "Description",
            placeholder: "Enter Description",
            multiline: true,
            onChange: (e) => setValue("description", e.currentTarget.value),
          },
          {
            render: ({ renderDetails }) => {
              return (
                <div className="flex flex-row">
                  {renderDetails({
                    id: "version",
                    title: "Version",
                    placeholder: "Enter Version",
                  })}
                  <span className="w-3" />
                  {renderDetails({
                    id: "env",
                    title: "Environment",
                    placeholder: "Enter Environment",
                  })}
                  <span className="w-3" />
                  {renderDetails({
                    id: "tools",
                    title: "Tools",
                    placeholder: "Enter Tools",
                  })}
                </div>
              );
            },
          },
          {
            render: ({ renderDetails }) => {
              return (
                <div className="flex flex-row">
                  {renderDetails({
                    id: "githubOwner",
                    title: "GitHub Owner",
                    placeholder: "Enter GitHub Owner",
                  })}
                  <span className="w-3" />
                  {renderDetails({
                    id: "githubProject",
                    title: "GitHub Project Name",
                    placeholder: "Enter GitHub Project Name",
                  })}
                  <span className="w-3" />
                  {renderDetails({
                    id: "tools",
                    title: "Tools",
                    placeholder: "Enter Tools",
                  })}
                </div>
              );
            },
          },
          {
            render: ({}) => {
              return (
                <div className="">
                  <p className="text-lg font-bold my-3">Members</p>
                  <div className="flex flex-row justify-between items-center">
                    <Button
                      type="invert"
                      text="Manage"
                      className="border-textPrimary"
                      textClassName="text-textPrimary"
                      onPress={onPressAddMember}
                    />
                    <div>
                      <TextInput
                        placeholder="Search"
                        onChange={(e) => onSearch(e.currentTarget.value)}
                      />
                    </div>
                  </div>
                  <Table
                    columns={[...memberColumns]}
                    dataSource={members}
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
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return { props: {} };
  }
  const user = await prisma.user.findFirst({
    where: { email: jsonParse(session).user.email },
    include: { member: true },
  });

  const { id } = context.query;
  const project = await prisma.project.findFirst({
    where: { id: { equals: parseInt(id) } },
    include: {
      members: {
        include: { user: true },
      },
      config: true,
    },
  });
  return {
    props: {
      project: jsonParse(project),
      user: jsonParse(user),
    },
  };
};

export default ProjectDetails;
