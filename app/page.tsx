"use client";
import axios from "axios";
import AddPost from "../app/components/AddPost";
import { useQuery } from "@tanstack/react-query";
import Post from "./components/Post";
import { PostsType } from "./types/posts";
import {Suspense} from "react"
import Loading from "../app/loading"
const allPosts = async () => {
  const response = await axios.get("/api/posts/getPosts");
  return response.data;
};

export default function Home() {
  const { data, error, isLoading } = useQuery<PostsType[]>({
    queryFn: allPosts,
    queryKey: ["posts"],
  });
  if (isLoading) return  <Loading/>;
  // if (error) return <div>Error: {error.message}</div>;

  // console.log("data in page app", data);
  return (
    <main className="">
      <AddPost />
      <Suspense fallback= {<Loading/>}>
      {data?.map((post) => (
        <Post
          comments={post.comments}
          key={post.id}
          name={post.user.name}
          avatar={post.user.image}
          postTitle={post.title}
          id={post.id}
        />
        ))}
        </Suspense>
    </main>
  );
}
