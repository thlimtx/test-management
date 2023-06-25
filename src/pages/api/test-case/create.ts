import { prisma } from "server/db/client";

const handler = async (req: any, res: any) => {
  const { body } = req;
  const { testPlanId, ...rest } = JSON.parse(body);

  const testCase = await prisma.testCase.create({
    data: {
      testPlanId,
      ...rest,
    },
  });
  return res.status(200).json(testCase);
};

export default handler;
