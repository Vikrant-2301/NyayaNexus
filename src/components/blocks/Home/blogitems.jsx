"use client";
import { assets } from "../../../../public/assets/assets";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const BlogItem = ({
  title,
  description,
  category,
  image,
  slug,
  author = "Adrio Devid",
  authorImg = assets.profile_icon,
}) => {
  const safeImage =
    typeof image === "string"
      ? image
      : image?.src
      ? image.src
      : "/default-image.jpg";

  const safeAuthorImg =
    typeof authorImg === "string"
      ? authorImg
      : authorImg?.src
      ? authorImg.src
      : "/default-avatar.png";

  const blogLink = slug ? `/blogs/${slug}` : "#";

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 max-w-sm w-full flex flex-col overflow-hidden">
      <Link href={blogLink} className="block">
        <Image
          src={safeImage}
          alt={title}
          width={400}
          height={250}
          className="w-full h-56 object-cover"
          priority
          unoptimized
        />
      </Link>

      <div className="p-5 flex flex-col flex-grow">
        <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {title}
        </h2>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{description}</p>
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-200 text-sm">
          <div className="flex items-center gap-2">
            <Image
              src={safeAuthorImg}
              alt="Author Avatar"
              width={28}
              height={28}
              className="rounded-full"
              unoptimized
            />
            <span className="text-gray-800 font-medium">{author}</span>
          </div>
          <span className="bg-blue-100 text-blue-600 px-2.5 py-0.5 rounded-full font-semibold text-xs">
            {category}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BlogItem;
