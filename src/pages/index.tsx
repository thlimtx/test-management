import { Button } from "@/components/Button";
import { Screen } from "@/components/Screen";
import { Box } from "@/components/Box";
import { useRouter } from "next/router";

const Landing = (props: any) => {
  const router = useRouter();

  return (
    <Screen>
      <Box>
        <div className="flex flex-1 flex-col justify-evenly text-center items-center">
          <p className="text-3xl italic font-bold">
            Welcome to the Test Management System
          </p>
          <p className="text-2xl italic ">Log in to get started.</p>
          <Button
            className="rounded-md w-40 max-w-full py-3"
            text="Get Started"
            onPress={() => router.push("/auth/login")}
          />
        </div>
      </Box>
    </Screen>
  );
};

export default Landing;
