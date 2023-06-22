import { prisma } from "server/db/client";

const handler = async (req: any, res: any) => {
  const { body } = req;
  const { id, reqCode, title, description } = JSON.parse(body);

  const requirement = await prisma.requirement.update({
    data: {
      reqCode,
      title,
      description,
    },
    where: { id },
  });
  return res.status(200).json(requirement);
};

export default handler;
