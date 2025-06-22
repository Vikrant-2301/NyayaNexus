//src\components\AdminComponents\BlogTableItem.jsx
import { assets } from "../../../public/assets/assets";
import Image from "next/image";
import React from "react";
import { Trash2 } from "lucide-react"; // optional: if using lucide icons

const BlogTableItem = ({
  authorImg,
  title,
  author,
  date,
  deleteBlog,
  mongoId,
}) => {
  const BlogDate = new Date(date);

  return (
    <tr className="bg-white border-b hover:bg-gray-50 transition duration-200">
      {/* Author + Image */}
      <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <Image
            className="rounded-full object-cover border border-gray-300"
            width={40}
            height={40}
            src={authorImg || "/default-image.jpg"} // Add a default image fallback
            alt={title || "Blog image"}
          />
          <span className="text-sm font-medium text-gray-800">
            {author || "Unknown Author"}
          </span>
        </div>
      </td>

      {/* Title */}
      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
        {title || "Untitled"}
      </td>

      {/* Date */}
      <td className="px-6 py-4 text-sm text-gray-600">
        {BlogDate.toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </td>

      {/* Delete Button */}
      <td className="px-6 py-4 text-red-500 text-sm">
        <button
          onClick={() => deleteBlog(mongoId)}
          className="hover:text-red-700 transition duration-150"
          title="Delete blog"
        >
          {/* You can use an icon or just text */}
          {/* <Trash2 size={18} /> */}
          Delete
        </button>
      </td>
    </tr>
  );
};

export default BlogTableItem;
