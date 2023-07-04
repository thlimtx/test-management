import { prisma } from "server/db/client";

const handler = async (req: any, res: any) => {
  const { body } = req;
  const { id, ...rest } = JSON.parse(body);
  const project = await prisma.project.update({
    where: { id },
    data: { ...rest },
  });
  return res.status(200).json(project);
};

export default handler;
