import { prisma } from "server/db/client";

const handler = async (req: any, res: any) => {
  const { body } = req;
  const { id } = JSON.parse(body);

  const testPlan = await prisma.testPlan.delete({
    where: { id },
  });
  return res.status(200).json(testPlan);
};

export default handler;
