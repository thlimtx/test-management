import { prisma } from "server/db/client";

const handler = async (req: any, res: any) => {
  const { body } = req;
  const { id } = JSON.parse(body);
  const project = await prisma.project.findFirst({
    where: { id: { equals: id } },
  });
  return res.status(200).json(project);
};

export default handler;
