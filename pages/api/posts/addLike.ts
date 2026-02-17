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
    return res.status(401).json({ message: "Please sign in to add/remove a like." });
  }

  if (req.method === "PUT") {
    const { postId, liked } = req.body;

    try {
      const currentPost = await prisma.post.findUnique({
        where: {
          id: postId,
        },
        select: {
          likes: true,
        },
      });

      if (!currentPost) {
        return res.status(404).json({ error: "Post not found" });
      }

      const updatedLikes = liked
        ? currentPost.likes + 1
        : Math.max(0, currentPost.likes - 1);

      const updatedPost = await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          likes: updatedLikes,
        },
      });

      res.status(200).json(updatedPost);
    } catch (err) {
      res.status(500).json({ error: "Error occurred while toggling the like status" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
