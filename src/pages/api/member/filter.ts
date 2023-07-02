import { getFilter } from "@/util/data";
import { prisma } from "server/db/client";

const handler = async (req: any, res: any) => {
  const { body } = req;
  const { projectId, search } = JSON.parse(body);
  const filter = search
    ? { user: { OR: getFilter({ name: search, email: search }) } }
    : {};
  const member = await prisma.member.findMany({
    where: {
      projectId: { equals: projectId },
      ...filter,
    },
    include: {
      user: true,
    },
    orderBy: { updatedAt: "desc" },
  });
  return res.status(200).json(member);
};

export default handler;
