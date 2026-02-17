"use client";
import axios from "axios";
import AddPost from "../app/components/AddPost";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Post from "./components/Post";
import { PostsType } from "./types/posts";
import {Suspense} from "react"
import Loading from "../app/loading"
const allPosts = async () => {
  const response = await axios.get("/api/posts/getPosts");
  return response.data;
};
export default function Home() {
  const queryClient = useQueryClient();
  const { data, error, isLoading } = useQuery<PostsType[]>({
    queryFn: allPosts,
    queryKey: ["posts"],
  });


  if (isLoading) return  <Loading/>;
  if (error) return (
    <div className="flex flex-col items-center gap-4 py-16">
      <p className="text-gray-600 text-lg">Something went wrong loading posts.</p>
      <button
        onClick={() => queryClient.invalidateQueries(["posts"])}
        className="bg-teal-600 text-white py-2 px-6 rounded-md text-sm"
      >
        Try Again
      </button>
    </div>
  );

  return (

    <main className="">
      <AddPost />
      <Suspense fallback= {<Loading/>}>
      {data && data.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No posts yet. Be the first to share something!</p>
      ) : (
        data?.map((post) => (
          <Post
            comments={post.comments}
            key={post.id}
            name={post.user.name}
            avatar={post.user?.image}
            postTitle={post.title}
            id={post.id}
            likes={post.likes}
            createdAt={post.createdAt}
          />
        ))
      )}
      </Suspense>
    </main>
  );
}
