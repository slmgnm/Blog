"use client";

type ToggleProps = {
  deletePost: () => void;
  setToggle: (toggle: boolean) => void;
};

export default function Toggle({ deletePost, setToggle }: ToggleProps) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setToggle(false);
      }}
      className="fixed bg-black/50 w-full h-full z-20 left-0 top-0 "
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute bg-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-12 rounded-lg flex flex-col gap-6"
      >
        <h2 className="text-xl">
          Are you sure you want to delete this post?
        </h2>
        <h3 className="text-red-600 text-sm">
          Pressing the delete button will permanently delete your post
        </h3>
        <div className="flex gap-4">
          <button
            onClick={deletePost}
            className="bg-red-600 text-sm text-white py-2 px-4 rounded-md"
          >
            Delete Post
          </button>
          <button
            onClick={() => setToggle(false)}
            className="bg-gray-200 text-sm text-gray-700 py-2 px-4 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
