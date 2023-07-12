import { prisma } from "server/db/client";

const handler = async (req: any, res: any) => {
  const { body } = req;
  const { userEmail } = JSON.parse(body);
  const projects = await prisma.project.findMany({
    where: { members: { some: { user: { email: userEmail } } } },
    orderBy: { updatedAt: "desc" },
  });
  return res.status(200).json(projects);
};

export default handler;
