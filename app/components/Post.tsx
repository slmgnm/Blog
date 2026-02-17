"use client";

import Image from "next/image";
import Link from "next/link";
import HeartButton from "./HeartButton";

type PostProps = {
  avatar?: string;
  name?: string;
  postTitle?: string;
  id?: string;
  comments?: any[];
  likes?: number;
  createdAt?: string;
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

export default function Post({ avatar, name, postTitle, id, comments, likes, createdAt }: PostProps) {
  return (
    <div className="bg-white my-8 p-8 rounded-lg">
      <div className="flex items-center gap-2">
        {avatar && (
          <Image
            className="rounded-full"
            width={32}
            height={32}
            src={avatar}
            alt="avatar"
          />
        )}

        <h3 className="font-bold text-gray-700">{name}</h3>
        {createdAt && (
          <span className="text-sm text-gray-400">{timeAgo(createdAt)}</span>
        )}
      </div>
      <div className=" flex my-8">
        <p className="break-all">{postTitle}</p>
      </div>

      <div className="flex gap-4 cursor-pointer items-center">
        <Link href={`/post/${id}`}>
          <p className="text-sm font-bold text-gray-700">
            {comments?.length} Comments
          </p>
        </Link>
        {id && <HeartButton postId={id} likes={likes ?? 0} />}
      </div>
    </div>
  );
}
