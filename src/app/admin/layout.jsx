"use client";

import Sidebar from "@/components/AdminComponents/Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col">
      {/* Horizontal Sidebar for mobile (non-sticky and pushed below navbar) */}
      <header className="sm:hidden bg-white mt-[84px] px-4">
        <Sidebar layout="horizontal" />
      </header>

      <div className="flex flex-1">
        {/* Sidebar for desktop (NOT sticky, with top margin to avoid navbar conflict) */}
        <aside className="hidden sm:flex sm:w-64 sm:flex-col bg-white border-r mt-[84px]">
          <Sidebar layout="vertical" />
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 pt-6 sm:pt-20 overflow-auto">
          <ToastContainer theme="dark" />
          {children}
        </main>
      </div>
    </div>
  );
}
