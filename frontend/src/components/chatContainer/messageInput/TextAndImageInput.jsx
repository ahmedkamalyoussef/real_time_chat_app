import { Image } from "lucide-react";

const TextAndImageInput = ({
  content,
  handleContentChange,
  fileInputRef,
  handleImageChange,
  imagePreview,
}) => (
  <div className="flex-1 flex gap-2 items-center">
    <input
      type="text"
      className="w-full input input-bordered rounded-lg input-sm sm:input-md"
      placeholder="Type a message..."
      value={content}
      onChange={handleContentChange}
    />

    <input
      type="file"
      accept="image/*"
      className="hidden"
      ref={fileInputRef}
      onChange={handleImageChange}
    />

    <button
      type="button"
      className={`sm:flex btn btn-circle ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
      onClick={() => fileInputRef.current?.click()}
    >
      <Image size={20} />
    </button>
  </div>
);

export default TextAndImageInput;
