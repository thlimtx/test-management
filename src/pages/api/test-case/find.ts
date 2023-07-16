import { prisma } from "server/db/client";

const handler = async (req: any, res: any) => {
  const { body } = req;
  const { projectId } = JSON.parse(body);

  const testCase = await prisma.testCase.findMany({
    where: {
      testPlan: { projectId },
    },
    orderBy: { code: "asc" },
  });
  return res.status(200).json(testCase);
};

export default handler;
