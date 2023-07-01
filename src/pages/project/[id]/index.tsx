import { Screen } from "@/components/Screen";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Project = () => {
  const router = useRouter();
  useEffect(() => {
    router && router.push(`/project/${router.query.id}/dashboard`);
  });
  // todo: Login session
  const userId = 1;
  return (
    <Screen>
      <div />
    </Screen>
  );
};

export default Project;
