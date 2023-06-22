import { prisma } from "server/db/client";

const handler = async (req: any, res: any) => {
  const { body } = req;
  const { id, testPlanCode, title, description, lastExecutedAt, status } =
    JSON.parse(body);

  const testPlan = await prisma.testPlan.update({
    data: {
      testPlanCode,
      title,
      description,
      lastExecutedAt,
      status,
    },
    where: { id },
  });
  return res.status(200).json(testPlan);
};

export default handler;
