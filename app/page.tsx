"use client";
import axios from "axios";
import AddPost from "../app/components/AddPost";
import { useQuery } from "@tanstack/react-query";
import Post from "./components/Post";
import { PostsType } from "./types/posts";
const allPosts = async () => {
  const response = await axios.get("/api/posts/getPosts");
  return response.data;
};

export default function Home() {
  const { data, error, isLoading } = useQuery<PostsType[]>({
    queryFn: allPosts,
    queryKey: ["posts"],
  });
  if (isLoading) return "loading";
  if (error) return error;
  console.log(data);
  return (
    <main className="">
      {/* <h1 className="text-large">Hello Next</h1> */}
      <AddPost />
      {data?.map((post) => (
        <Post
        Comment={post.Comment}
          key={post.id}
          name={post.user.name}
          avatar={post.user.image}
          postTitle={post.title}
          id={post.id}
        />
      ))}
    </main>
  );
}
