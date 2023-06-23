import { prisma } from "server/db/client";

const handler = async (req: any, res: any) => {
  const { body } = req;
  const { id, ...rest } = JSON.parse(body);

  const testCase = await prisma.testCase.update({
    data: {
      ...rest,
    },
    where: { id },
  });
  return res.status(200).json(testCase);
};

export default handler;
