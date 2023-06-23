import { prisma } from "server/db/client";

const handler = async (req: any, res: any) => {
  const { body } = req;
  const { testPlanId, reqId, isChecked } = JSON.parse(body);
  const reference = isChecked
    ? await prisma.reference.delete({
        where: {
          testPlanId_reqId: {
            reqId,
            testPlanId,
          },
        },
      })
    : await prisma.reference.create({
        data: { reqId, testPlanId },
      });
  return res.status(200).json(reference);
};

export default handler;
