import { prisma } from "server/db/client";

const handler = async (req: any, res: any) => {
  const { body } = req;
  const { id, name } = JSON.parse(body);
  const user = await prisma.project.update({
    where: { id },
    data: { name },
  });
  return res.status(200).json(user);
};

export default handler;
