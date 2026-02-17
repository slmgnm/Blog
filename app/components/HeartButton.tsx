import React, { useRef, useState } from 'react';
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
  likes: number;
}

const HeartButton: React.FC<HeartButtonProps> = ({ postId, likes }) => {
  const [liked, setLiked] = useState(getFromLocalStorage(`liked_${postId}`) || false);
  let likeToastId = useRef<string | undefined>(undefined);

  const queryClient = useQueryClient();
  const { mutate: likeMutate } = useMutation(
    async ({ postId, liked }: { postId: string; liked: boolean }) => {
      return axios.put("/api/posts/addLike", { postId, liked });
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["posts"]);
        queryClient.invalidateQueries(["detail-post"]);
        setLiked(!liked);
        saveToLocalStorage(`liked_${postId}`, !liked);
        toast.success(liked ? "Unliked" : "Liked", { id: likeToastId.current });
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          toast.error(error?.response?.data.message, {
            id: likeToastId.current,
          });
        }
      },
    }
  );

  const handleLikeClick = () => {
    likeMutate({ postId, liked: !liked });
  };

  return (
    <button
      onClick={handleLikeClick}
      className={`flex items-center gap-1 ${liked ? 'text-teal-600' : 'text-gray-600'}`}
    >
      <FontAwesomeIcon icon={liked ? solidHeart : regularHeart} />
      <span className="text-sm">{likes ?? 0}</span>
    </button>
  );
};

export default HeartButton;
