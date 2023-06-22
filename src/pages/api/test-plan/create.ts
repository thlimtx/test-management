import { prisma } from "server/db/client";

const handler = async (req: any, res: any) => {
  const { body } = req;
  const { testPlanCode, title, description, projectId } = JSON.parse(body);

  const testPlan = await prisma.testPlan.create({
    data: {
      testPlanCode,
      title,
      description,
      projectId: projectId,
    },
  });
  return res.status(200).json(testPlan);
};

export default handler;
