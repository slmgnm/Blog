"use client";
import axios from "axios";
import AddPost from "../app/components/AddPost";
import { useQuery } from "@tanstack/react-query";
const allPosts = async () => {
  const response = await axios.get("/api/posts/getPosts");
  return response.data;
};

export default function Home() {
  const { data, error, isLoading } = useQuery({
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
    </main>
  );
}
