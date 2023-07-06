import { Role } from "@prisma/client";
import { prisma } from "server/db/client";

const handler = async (req: any, res: any) => {
  const { body } = req;
  const { userId, ...rest } = JSON.parse(body);

  const project = await prisma.project.create({
    data: {
      ...rest,
      members: {
        create: {
          user: { connect: { id: userId } },
          role: { set: [Role.OWNER] },
        },
      },
    },
  });
  if (!project) {
    throw new Error("Failed to create project.");
  }

  const build = await prisma.build.create({
    data: { projectId: project.id },
  });
  const deploy = await prisma.deploy.create({
    data: { projectId: project.id },
  });
  if (!build) {
    throw new Error("Failed to create build.");
  }
  if (!deploy) {
    throw new Error("Failed to create deploy.");
  }

  return res.status(200).json(project);
};

export default handler;
