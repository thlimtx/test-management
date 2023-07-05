import { hash } from "bcrypt";
import { prisma } from "server/db/client";
import fs from "fs";

const handler = async (req: any, res: any) => {
  const { body } = req;
  const { id, name, email, image } = JSON.parse(body);
  const user = await prisma.user.update({
    where: { id },
    data: {
      name,
      email,
      image,
      updatedAt: new Date(),
    },
  });
  return res.status(200).json(user);
};

export default handler;
