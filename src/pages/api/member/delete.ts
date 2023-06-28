import { prisma } from "server/db/client";

const handler = async (req: any, res: any) => {
  const { body } = req;
  const { projectId, userId } = JSON.parse(body);
  const member = await prisma.member.delete({
    where: { projectId_userId: { projectId, userId } },
  });
  return res.status(200).json(member);
};

export default handler;
