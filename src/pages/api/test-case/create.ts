import { prisma } from "server/db/client";

const handler = async (req: any, res: any) => {
  const { body } = req;
  const {
    testPlanId,
    // other data
    testCaseCode,
    title,
    description,
    data,
    expected,
    precondition,
    priority,
    script,
    steps,
    type,
    status,
    lastExecutedAt,
    result,
  } = JSON.parse(body);

  const testCase = await prisma.testCase.create({
    data: {
      testPlanId,
      // other data
      testCaseCode,
      title,
      description,
      data,
      expected,
      precondition,
      priority,
      script,
      steps,
      type,
      status,
      lastExecutedAt,
      result,
    },
  });
  return res.status(200).json(testCase);
};

export default handler;
