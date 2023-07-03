import { prisma } from "server/db/client";

const handler = async (req: any, res: any) => {
  const { body } = req;
  const { email } = JSON.parse(body);
  const user = await prisma.user.findFirst({
    where: { email: { equals: email } },
    include: { member: true },
  });
  return res.status(200).json(user);
};

export default handler;
