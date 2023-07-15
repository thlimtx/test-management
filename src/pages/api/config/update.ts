import { prisma } from "server/db/client";

const handler = async (req: any, res: any) => {
  const { body } = req;
  const { projectId, ...rest } = JSON.parse(body);
  const user = await prisma.config.update({
    where: { projectId },
    data: { ...rest },
  });
  return res.status(200).json(user);
};

export default handler;
