import { hash } from "bcrypt";
import { prisma } from "server/db/client";

const handler = async (req: any, res: any) => {
  const { body } = req;
  const { name, email, password } = JSON.parse(body);
  const encryptedPassword = await hash(password, 12);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: encryptedPassword,
    },
  });
  return res.status(200).json(user);
};

export default handler;
