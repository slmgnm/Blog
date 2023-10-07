"use client"
import React, { useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

import "@fortawesome/fontawesome-svg-core/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';

interface HeartButtonProps {
  postId: string;
}
type Like = {
  liked: boolean;
 
};


const HeartButton: React.FC<HeartButtonProps> = ({ postId }:HeartButtonProps) => {
  const [liked, setLiked] = useState(JSON.parse(localStorage.getItem('liked')) || false);
  let likeToastId = useRef<string | undefined>(undefined);

  useEffect(() => {
    localStorage.setItem('liked', JSON.stringify(liked));
  }, [liked]);

  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    
    async (postId: string) => {
      // Send a request to update the likes count in the database
      return axios.put("/api/posts/addLike",{data:postId});
    },
    {
      onSuccess: (data) => {
       
        // Assuming the server responds with the updated likes count
        const updatedLikes = data; // Adjust this based on your API response
        console.log("data in heartbutton", data)
        queryClient.setQueryData(["getAuthPosts"], (prevData: any) => ({
          ...prevData,
          likes: updatedLikes,
        }));
        setLiked(true);

        toast.success("Liked", { id: likeToastId.current });
      },
      onError: (error) => {
        console.log(error);
        if (error instanceof AxiosError) {
          toast.error(error?.response?.data.message, {
            id: likeToastId.current,
          });
        }
      },
    }
  );

  const handleLikeClick = () => {
    setLiked(!liked);
    mutate(postId );
    console.log("postId in heart button submit",postId);
  };

  return (
    <button
      onClick={handleLikeClick}
      className={`${liked ? 'text-teal-600' : 'text-gray-600'}`}
    >
      <FontAwesomeIcon icon={liked ? solidHeart : regularHeart} />
      {liked ? 'Liked' : 'Like'}
    </button>
  );
};

export default HeartButton;
