import { prisma } from "server/db/client";

const handler = async (req: any, res: any) => {
  const { body } = req;
  const { projectId, userId, ...rest } = JSON.parse(body);
  const member = await prisma.member.update({
    where: { projectId_userId: { projectId, userId } },
    data: { ...rest },
  });
  return res.status(200).json(member);
};

export default handler;
