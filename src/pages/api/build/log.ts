import { prisma } from "server/db/client";

const handler = async (req: any, res: any) => {
  const { body } = req;
  const { projectId } = JSON.parse(body);
  const build = await prisma.build.findFirst({
    where: { projectId: { equals: projectId } },
  });
  if (!build) {
    throw new Error("Failed to find delpoyment details.");
  }
  build.token;
  const result =
    build.getEndpoint &&
    (await fetch(build.getEndpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${build.token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        return res.status(200).json(data);
      }));
  return res.status(200).json(build);
};

export default handler;
