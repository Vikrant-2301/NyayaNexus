"use client";

import {
  FaPlusCircle,
  FaListAlt,
  FaComments,
  FaEnvelope,
  FaUser,
  FaNewspaper,
} from "react-icons/fa";
import Link from "next/link";
import React from "react";

const navLinks = [
  { href: "/admin/addBlog", icon: <FaPlusCircle />, label: "Add Blog" },
  { href: "/admin/blogList", icon: <FaListAlt />, label: "Blog List" },
  { href: "/admin/comments", icon: <FaComments />, label: "Comments" },
  {
    href: "/admin/subscriptions",
    icon: <FaEnvelope />,
    label: "Subscriptions",
  },
  { href: "/admin/authors", icon: <FaUser />, label: "Authors" },
  {
    href: "/admin/article-submissions",
    icon: <FaNewspaper />,
    label: "Article Submissions",
  },
];

const Sidebar = ({ layout = "vertical" }) => {
  const isHorizontal = layout === "horizontal";

  return (
    <nav
      className={`${
        isHorizontal
          ? "grid grid-cols-2 xs:grid-cols-3 gap-3 w-full px-4 pb-2"
          : "flex flex-col gap-3 w-full px-4 py-4"
      }`}
    >
      {navLinks.map(({ href, icon, label }, index) => (
        <Link
          key={index}
          href={href}
          className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition text-sm font-medium w-full"
        >
          <span className="text-lg">{icon}</span>
          <span className="truncate">{label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default Sidebar;
