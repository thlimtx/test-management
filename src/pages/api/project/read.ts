import { prisma } from "server/db/client";

const handler = async (req: any, res: any) => {
  const { body } = req;
  const { userId } = JSON.parse(body);
  const projects = await prisma.project.findMany({
    where: { members: { some: { userId } } },
  });
  return res.status(200).json(projects);
};

export default handler;
