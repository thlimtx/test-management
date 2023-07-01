import { getFilter } from "@/util/data";
import { prisma } from "server/db/client";

const handler = async (req: any, res: any) => {
  const { body } = req;
  const { userId, ...rest } = JSON.parse(body);
  const filter = getFilter({ ...rest });
  const project = await prisma.project.findMany({
    where: { members: { some: { userId } }, ...filter },
    include: {
      members: true,
    },
    orderBy: { updatedAt: "desc" },
  });
  return res.status(200).json(project);
};

export default handler;
