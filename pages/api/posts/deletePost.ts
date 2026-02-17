import prisma from "../../../prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: "Please signin to edit a post." });
    }
    const postId = req.body;

    try {
      const prismaUser = await prisma.user.findUnique({
        where: { email: session?.user?.email || "" },
      });

      if (!prismaUser) {
        return res.status(401).json({ message: "User not found" });
      }

      const post = await prisma.post.findUnique({
        where: { id: postId },
      });

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      if (post.userId !== prismaUser.id) {
        return res.status(403).json({ message: "You can only delete your own posts." });
      }

      const result = await prisma.post.delete({
        where: {
          id: postId,
        },
      });

      res.status(200).json(result);
    } catch (err) {
      res.status(403).json({ err: "Error has occured while deleting a post" });
    }
  }
}
