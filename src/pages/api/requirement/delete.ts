import { prisma } from "server/db/client";

const handler = async (req: any, res: any) => {
  const { body } = req;
  const { id } = JSON.parse(body);

  const requirement = await prisma.requirement.delete({
    where: { id },
  });
  return res.status(200).json(requirement);
};

export default handler;
