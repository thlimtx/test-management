import { Details } from "@/components/Details";
import { Screen } from "@/components/Screen";
import { jsonParse } from "@/util/format";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { prisma } from "server/db/client";
import { memberColumns, projectFields } from "./data";
import { Button } from "@/components/Button";
import { TextInput } from "@/components/TextInput";
import { Table } from "antd";
import { getPermission } from "@/permission/data";
import { Member, User } from "@prisma/client";
import { debounce } from "lodash";
import { getServerSession } from "next-auth";
import authOptions from "@/pages/api/auth/[...nextauth]";

const ProjectDetails = (props: any) => {
  const { project, user } = props;
  const data = {
    ...project,
  };
  const projectId = project?.id;

  const router = useRouter();

  const { id } = data;
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit } = useForm();
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
          ...projectFields,
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
