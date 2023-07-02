import { getFilter } from "@/util/data";
import { head } from "lodash";
import { prisma } from "server/db/client";

const handler = async (req: any, res: any) => {
  const { body } = req;
  const { userId, search } = JSON.parse(body);
  const filter = head(getFilter({ name: search }));
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
