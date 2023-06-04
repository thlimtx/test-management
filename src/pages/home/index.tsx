import { Button } from "@/components/Button";
import { prisma } from "../../../server/db/client";
import { Screen } from "@/components/Screen";

const Home = (props: any) => {
  const createUser = async (item: any) => {
    const res = await fetch("api/user", {
      method: "POST",
      body: JSON.stringify(item),
    });
  };
  const createProject = async (item: any) => {
    const res = await fetch("api/project", {
      method: "POST",
      body: JSON.stringify(item),
    });
  };

  return (
    <Screen>
      <div>Home</div>
      <div
        onClick={() => {
          createUser({ name: "press3", email: "press3@press.com" });
        }}
      >
        Press
      </div>
      <Button
        onPress={() => {
          createProject({ name: "p1" });
        }}
        text="Create Project"
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
