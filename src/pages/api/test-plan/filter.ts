import { getFilter } from "@/util/data";
import { Prisma } from "@prisma/client";
import { prisma } from "server/db/client";

const handler = async (req: any, res: any) => {
  const { body } = req;
  const { projectId, search } = JSON.parse(body);
  const filter: Prisma.TestPlanWhereInput = search
    ? { OR: getFilter({ code: search, title: search }) }
    : {};
  const testPlan = await prisma.testPlan.findMany({
    where: {
      projectId: { equals: projectId },
      ...filter,
    },
    include: { testCase: true },
    orderBy: { code: "asc" },
  });
  return res.status(200).json(testPlan);
};

export default handler;
