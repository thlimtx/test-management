import { Details } from "@/components/Details";
import { Screen } from "@/components/Screen";
import { Sidebar } from "@/components/Sidebar";
import { jsonParse } from "@/util/format";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { prisma } from "server/db/client";
import { memberColumns, projectFields } from "./data";
import { Button } from "@/components/Button";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { TextInput } from "@/components/TextInput";
import { Table } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { find, includes } from "lodash";

const ProjectDetails = (props: any) => {
  const { project } = props;
  const data = {
    ...project,
  };

  const router = useRouter();

  const { id } = data;
  // todo: Login session
  const userId = 1;
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit } = useForm();

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

  // TODO: search
  const onSearch = (data: any) => {};
  const onPressAddMember = () => router.push(router.asPath + "/members");

  const onSubmit = (data: any) => {
    updateProjectDetails({ id, ...data });
  };

  return (
    <Screen>
      <div className="flex flex-1">
        <Sidebar />
        <Details
          isEditing={isEditing}
          editable
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
                          onChange={(text) => onSearch(`${text}`)}
                        />
                      </div>
                    </div>
                    <Table
                      columns={[...memberColumns]}
                      dataSource={project.members}
                      rowKey={(data) => `${data.userId}`}
                    />
                  </div>
                );
              },
            },
          ]}
        />
      </div>
    </Screen>
  );
};

export const getServerSideProps = async (context: any) => {
  // todo: Login session
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
    },
  };
};

export default ProjectDetails;
