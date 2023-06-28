import { useRouter } from "next/router";
import { Button } from "../Button";
import { useEffect, useState } from "react";
import { Project } from "@prisma/client";

export const Header = (props: any) => {
  const router = useRouter();
  const projectId = router.query.id;

  const [project, setProject] = useState<Project | null>();

  useEffect(() => {
    findProject(projectId);
  }, [projectId]);

  const findProject = async (item: any) => {
    const res = await fetch("/api/project/find", {
      method: "POST",
      body: JSON.stringify({ id: parseInt(item) }),
    });
    if (res.ok) {
      const data = await res.json();
      setProject(data);
    } else {
      setProject(null);
    }
  };

  return (
    <div
      className={`fixed header-height mb-1 w-full shadow bg-primaryBg p-2 flex flex-row items-center ${props.className}`}
      style={props.style}
    >
      <div className="flex-1 flex flex-row px-2">
        <img src="https://picsum.photos/30" />
      </div>
      {projectId ? (
        <div className="flex flex-row mx-5">
          <p>{project?.name}</p>
        </div>
      ) : (
        <div className="flex flex-row">
          <Button
            text="Sign up"
            className="mr-2 rounded-full"
            type="invert"
            onPress={() => router.push("/signup")}
          />
          <Button
            text="Login"
            className="rounded-full"
            onPress={() => router.push("/login")}
          />
        </div>
      )}
    </div>
  );
};
