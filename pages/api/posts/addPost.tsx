import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
// import { AuthOptions } from "next-auth";
import prisma from "../../../prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions);
    if (!session)
      return res
        .status(401)
        .json({ message: "Please sing in to make a new post" });

    const title: string = req.body.title;

    //get User
    let prismaUser = await prisma.user.findUnique({
      where: { email: session?.user?.email ?? "" },
    });

    if (!prismaUser) {
      prismaUser = await prisma.user.create({
        data: {
          name: session?.user?.name ?? "",
          email: session?.user?.email ?? "",
          image: session?.user?.image ?? "",
        },
      });
    }
    if (title.length > 300) {
      return res.status(403).json({ message: "Please write a shorter post" });
    }
    if (!title.length)
      return res
        .status(403)
        .json({ message: "Please do not leave this field empty" });
    //create a post
    try {
      const result = await prisma.post.create({
        data: { title, userId: prismaUser.id },
      });
      res.status(200).json(result);
    } catch (error) {
      res.status(403).json({ err: "Error occured while creating a post" });
    }
  }
}
