import { getFilter } from "@/util/data";
import { prisma } from "server/db/client";

const handler = async (req: any, res: any) => {
  const { body } = req;
  const { projectId, search } = JSON.parse(body);
  const filter = search
    ? { OR: getFilter({ reqCode: search, title: search }) }
    : {};
  const requirement = await prisma.requirement.findMany({
    where: {
      projectId: { equals: projectId },
      ...filter,
    },
    orderBy: { reqCode: "asc" },
  });
  return res.status(200).json(requirement);
};

export default handler;
