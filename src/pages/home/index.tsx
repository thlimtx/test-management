import { Button } from "@/components/Button";
import { prisma } from "../../../server/db/client";
import { Screen } from "@/components/Screen";

const Home = (props: any) => {
  const createUser = async (item: any) => {
    const res = await fetch("api/user/create", {
      method: "POST",
      body: JSON.stringify(item),
    });
  };
  const createProject = async (item: any) => {
    const res = await fetch("api/project/create", {
      method: "POST",
      body: JSON.stringify(item),
    });
  };
  const updateProject = async (item: any) => {
    const res = await fetch("api/project/update", {
      method: "POST",
      body: JSON.stringify(item),
    });
  };
  const deleteProject = async (item: any) => {
    const res = await fetch("api/project/delete", {
      method: "POST",
      body: JSON.stringify(item),
    });
  };

  return (
    <Screen>
      <div>Home</div>
      <Button
        onPress={() => {
          createUser({ name: "press4", email: "press4@press.com" });
        }}
        text="Create User"
      />
      <Button
        onPress={() => {
          createProject({ name: "p2" });
        }}
        text="Create Project"
      />
      <Button
        onPress={() => {
          updateProject({ id: 1, name: "p2" });
        }}
        text="Update Project"
      />
      <Button
        onPress={() => {
          deleteProject({ id: 1 });
        }}
        text="Delete Project"
      />
    </Screen>
  );
};

export const getServerSideProps = async () => {
  const allUsers = await prisma.user.findMany();
  return {
    props: {
      user: allUsers,
    },
  };
};

export default Home;
