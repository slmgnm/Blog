"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AuthPosts } from "../types/AuthPosts";
import EditPost from "./EditPost";

const fetchAuthPosts = async () => {
  const response = await axios.get("/api/posts/authPosts");
  return response.data;
};

export default function MyPosts(): JSX.Element {
  const { data, isLoading } = useQuery<AuthPosts>({
    queryFn: fetchAuthPosts,
    queryKey: ["getAuthPosts"],
  });
  if (isLoading) return <h1>Posts are loading...</h1>;
  console.log("data in myPosts", data);
  return (
    <div>
      {data?.posts.map((post) => (
        <EditPost
          id={post.id}
          key={post.id}
          title={post.title}
          comments={post.comments}
          avatar={data.image}
          name={data.name}
        />
      ))}
    </div>
  );
}
