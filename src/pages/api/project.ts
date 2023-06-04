import { prisma } from "../../../server/db/client";

const handler = async (req: any, res: any) => {
  const { body } = req;
  const { name } = JSON.parse(body);
  const user = await prisma.project.create({
    data: {
      name,
    },
  });
  return res.status(200).json(user);
};

export default handler;
