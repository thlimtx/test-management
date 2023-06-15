import { prisma } from "server/db/client";

const handler = async (req: any, res: any) => {
  const { body } = req;
  const { name, email, password } = JSON.parse(body);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password,
    },
  });
  return res.status(200).json(user);
};

export default handler;
