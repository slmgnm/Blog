import prisma from "../../../prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res
      .status(401)
      .json({ message: "Please signin to post a comment." });
  }
  //Get User
  const prismaUser = await prisma.user.findUnique({
    where: { email: session?.user?.email || "" },
  });

  if (!prismaUser) {
    return res.status(401).json({ message: "User not found" });
  }

  if (req.method === "POST") {
    const { title, postId } = req.body.data;
    // console.log(title, postId);
    if (!title.length) {
      return res.status(401).json({ message: "Please enter some text" });
    }
    try {
      const result = await prisma.comment.create({
        data: {
          title,
          userId: prismaUser.id,
          postId,
        },
      });
      res.status(200).json(result);
    } catch (err) {
      res.status(403).json({ err: "Error has occurred while making a post" });
    }
  }
}
