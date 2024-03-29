import { prisma } from "server/db/client";

const handler = async (req: any, res: any) => {
  const { body } = req;
  const { code, title, description, projectId } = JSON.parse(body);

  const requirement = await prisma.requirement.create({
    data: {
      code,
      title,
      description,
      projectId: projectId,
    },
  });
  return res.status(200).json(requirement);
};

export default handler;
