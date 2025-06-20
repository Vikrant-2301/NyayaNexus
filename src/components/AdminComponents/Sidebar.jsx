"use client";

import { assets } from "../../../public/assets/assets";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Sidebar = () => {
  return (
    <nav className="flex flex-col h-full px-6 py-8 space-y-4 bg-white border-r border-gray-200">
      <SidebarLink
        href="/admin/addBlog"
        icon={assets.add_icon}
        label="Add Blog"
      />
      <SidebarLink
        href="/admin/blogList"
        icon={assets.blog_icon}
        label="Blog List"
      />
      <SidebarLink
        href="/admin/subscriptions"
        icon={assets.email_icon}
        label="Subscriptions"
      />
    </nav>
  );
};

const SidebarLink = ({ href, icon, label }) => (
  <Link
    href={href}
    className="flex items-center gap-3 px-4 py-2 rounded-md border border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition text-sm font-medium"
  >
    <Image src={icon} alt="" width={20} height={20} />
    <span>{label}</span>
  </Link>
);

export default Sidebar;
