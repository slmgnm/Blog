"use client";

import AddComment from "@/app/components/AddComment";
import Post from "@/app/components/Post";
import { PostType } from "@/app/types/Post";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { motion } from "framer-motion";
import Loading from "@/app/loading";

type URL = {
  params: {
    slug: string;
  };
};

function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals: [number, string][] = [
    [31536000, "year"],
    [2592000, "month"],
    [86400, "day"],
    [3600, "hour"],
    [60, "minute"],
  ];

  for (const [secondsInUnit, unit] of intervals) {
    const count = Math.floor(seconds / secondsInUnit);
    if (count >= 1) {
      return `${count} ${unit}${count > 1 ? "s" : ""} ago`;
    }
  }
  return "just now";
}

const fetchDetails = async (slug: string) => {
  const response = await axios.get(`/api/posts/${slug}`);
  return response.data;
};
export default function PostDetail(url: URL) {
  const { data, isLoading } = useQuery<PostType>({
    queryKey: ["detail-post"],
    queryFn: () => fetchDetails(url.params.slug),
  });

  if (isLoading) return <Loading />;

  return (
    <div>
      <Post
        id={data?.id}
        name={data?.user.name}
        avatar={data?.user.image}
        postTitle={data?.title}
        comments={data?.comments}
        likes={data?.likes}
        createdAt={data?.createdAt}
      />
      <AddComment id={data?.id} />

      {data?.comments && data.comments.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No comments yet. Be the first to comment!</p>
      ) : (
        data?.comments?.map((comment) => (
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.8 }}
            transition={{ ease: "easeOut" }}
            className="my-6 bg-white p-8 rounded-md"
            key={comment.id}
          >
            <div className="flex items-center gap-2">
              {comment.user?.image && (
                <Image
                  width={24}
                  height={24}
                  src={comment.user?.image}
                  alt="avatar"
                />
              )}

              <h3 className="font-bold">{comment?.user?.name}</h3>
              {comment.createdAt && (
                <h2 className="text-sm text-gray-400">{timeAgo(comment.createdAt)}</h2>
              )}
            </div>
            <div className="py-4">{comment.title}</div>
          </motion.div>
        ))
      )}
    </div>
  );
}
