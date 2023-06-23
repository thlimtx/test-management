import { Details } from "@/components/Details";
import { Screen } from "@/components/Screen";
import { Sidebar } from "@/components/Sidebar";
import { jsonParse } from "@/util/format";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { prisma } from "server/db/client";
import { projectFields } from "./data";

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
    console.log(item);

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
          fields={[...projectFields]}
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
  });
  return {
    props: {
      project: jsonParse(project),
    },
  };
};

export default ProjectDetails;
