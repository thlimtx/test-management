import { prisma } from "server/db/client";

const handler = async (req: any, res: any) => {
  const { body } = req;
  const { id, githubOwner, githubProject, ...rest } = JSON.parse(body);

  const config = await prisma.config.update({
    where: { projectId: id },
    data: { githubOwner, githubProject },
  });
  const project = await prisma.project.update({
    where: { id },
    data: { ...rest },
  });
  return res.status(200).json(project);
};

export default handler;
