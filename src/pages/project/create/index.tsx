import { Form } from "@/components/Form";
import { Screen } from "@/components/Screen";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { get } from "lodash";

const CreateProject = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const session = useSession();
  const user = session.data?.user;
  const userId = parseInt(`${get(user, "id")}`);

  const createProject = async (item: any) => {
    const res = await fetch("../api/project/create", {
      method: "POST",
      body: JSON.stringify({ ...item, userId }),
    });
  };

  const onSubmit = (data: any) => {
    createProject(data)
      .then(() => router.push("/home"))
      .catch(() => alert("Failed to create project."));
  };

  return (
    <Screen>
      <Form
        register={register}
        title="Create a Project"
        fields={[
          { id: "name", placeholder: "Project Name" },
          { id: "description", placeholder: "Project Description" },
          { id: "version", placeholder: "Project version" },
          { id: "env", placeholder: "Project Environment" },
          { id: "tool", placeholder: "Project Tools" },
        ]}
        buttons={[
          { text: "Back", onPress: () => router.back(), type: "invert" },
          { text: "Create", onPress: handleSubmit(onSubmit) },
        ]}
      />
    </Screen>
  );
};

export default CreateProject;
