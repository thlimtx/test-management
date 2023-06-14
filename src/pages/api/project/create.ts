import { Role } from "@prisma/client";
import { prisma } from "server/db/client";

const handler = async (req: any, res: any) => {
  const { body } = req;
  const { userId, name, description, env, tools, version } = JSON.parse(body);

  const project = await prisma.project.create({
    data: {
      name,
      description,
      env,
      tools,
      version,
      members: {
        create: {
          user: {
            connect: { id: userId }, // Replace `userId` with the actual user ID
          },
          role: {
            set: [Role.OWNER], // Set the role of the member
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  return res.status(200).json(project);
};

export default handler;
