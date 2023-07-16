import { prisma } from "server/db/client";

const handler = async (req: any, res: any) => {
  const { body } = req;
  const { id } = JSON.parse(body);

  const reference = await prisma.reference.deleteMany({
    where: { testPlanId: id },
  });
  const testCase = await prisma.testCase.deleteMany({
    where: { testPlanId: id },
  });
  const testPlan = await prisma.testPlan.delete({
    where: { id },
  });
  return res.status(200).json(testPlan);
};

export default handler;
