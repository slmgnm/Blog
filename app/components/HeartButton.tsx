import React, { useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { saveToLocalStorage, getFromLocalStorage } from './saveToLS'; 

interface HeartButtonProps {
  postId: string;
}

const HeartButton: React.FC<HeartButtonProps> = ({ postId }: HeartButtonProps) => {
  const [liked, setLiked] = useState(getFromLocalStorage(`liked_${postId}`) || false);
  let likeToastId = useRef<string | undefined>(undefined);

  const queryClient = useQueryClient();
  const { mutate: likeMutate } = useMutation(
    async (postId: string) => {
      // Send a request to update the likes count in the database
      return axios.put("/api/posts/addLike", { data: postId });
    },
    {
      onSuccess: (data) => {
        const updatedLikes = data;
        // console.log(updatedLikes, "updated");
        queryClient.setQueryData(["getAuthPosts"], (prevData: any) => ({
          ...prevData,
          likes: updatedLikes,
        }));
        setLiked(!liked); // Toggle liked state after updating
        saveToLocalStorage(`liked_${postId}`, !liked); // Save updated liked state to localStorage
        toast.success(liked ? "Unliked" : "Liked", { id: likeToastId.current });
      },
      onError: (error) => {
        // console.log(error);
        if (error instanceof AxiosError) {
          toast.error(error?.response?.data.message, {
            id: likeToastId.current,
          });
        }
      },
    }
  );

  const handleLikeClick = () => {
    // Toggle the like state and call the mutation
    likeMutate(postId);
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
