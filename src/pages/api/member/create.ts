import { prisma } from "server/db/client";

const handler = async (req: any, res: any) => {
  const { body } = req;
  const { projectId, userId, role } = JSON.parse(body);
  const member = await prisma.member.create({
    data: { projectId, userId, role },
  });
  return res.status(200).json(member);
};

export default handler;
