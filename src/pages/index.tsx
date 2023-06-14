import { Button } from "@/components/Button";
import { prisma } from "server/db/client";
import { Screen } from "@/components/Screen";
import { jsonParse } from "@/util/format";
import { Box } from "@/components/Box";
import { useRouter } from "next/router";

const Home = (props: any) => {
  const router = useRouter();
  return (
    <Screen>
      <Box>
        <div className="flex flex-1 flex-col justify-evenly text-center items-center">
          <p className="text-3xl italic font-bold">
            Welcome to the Test Management System
          </p>
          <p className="text-2xl italic ">
            You currently do not have any projects yet.
          </p>
          <Button
            className="rounded-full w-40 max-w-full py-3"
            text="Get Started"
            onPress={() => router.push("/create-project")}
          />
        </div>
      </Box>
    </Screen>
  );
};

export const getServerSideProps = async () => {
  const allProjects = await prisma.project.findMany();
  return {
    props: {
      projects: jsonParse(allProjects),
    },
  };
};

export default Home;
