import { prisma } from "../../../server/db/client";
import { Screen } from "@/components/Screen";

const Home = (props: any) => {
  const createUser = async (item: any) => {
    const res = await fetch("api/user", {
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
