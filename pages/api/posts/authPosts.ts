import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
// import { AuthOptions } from "next-auth";
import prisma from "../../../prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Please signin to create a post." });
  }

  if (req.method === "GET") {
    try {
      const sessionEmail = session.user?.email; 
      if (!sessionEmail) {
        return res.status(401).json({ message: "Please sign in to create a post." });
      }
  
      const data = await prisma.user.findUnique({
        where: {
          email: sessionEmail, 
        },
        include: {
          posts: {
            orderBy: {
              createdAt: "desc",
            },
            include: {
              comments: true,
            },
          },
        },
      });
  
      return res.status(200).json(data);
    } catch (err) {
      res.status(403).json({ err: "Error has occurred while making a post" });
    }
  }
  
}