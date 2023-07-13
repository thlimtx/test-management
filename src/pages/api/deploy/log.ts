import { prisma } from "server/db/client";

const handler = async (req: any, res: any) => {
  const { body } = req;
  const { projectId } = JSON.parse(body);
  const deploy = await prisma.deploy.findFirst({
    where: { projectId: { equals: projectId } },
  });
  if (!deploy) {
    throw new Error("Failed to find delpoyment details.");
  }
  deploy.token;
  const result =
    deploy.getEndpoint &&
    (await fetch(deploy.getEndpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${deploy.token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        return res.status(200).json(data);
      }));
  return res.status(200).json(deploy);
};

export default handler;
