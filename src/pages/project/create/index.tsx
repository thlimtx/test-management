import { Form } from "@/components/Form";
import { Screen } from "@/components/Screen";
import { useRouter } from "next/router";

const CreateProject = () => {
  const router = useRouter();

  const createProject = async (item: any) => {
    const res = await fetch("../api/project/create", {
      method: "POST",
      body: JSON.stringify({ ...item, userId: 1 }),
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
          { text: "Create", submit: true },
        ]}
        onSubmit={onSubmit}
      />
    </Screen>
  );
};

export default CreateProject;
