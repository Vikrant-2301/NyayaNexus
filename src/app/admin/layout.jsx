"use client";

import Sidebar from "@/Components/AdminComponents/Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      {/* Sidebar with top padding */}
      <aside className="w-64 hidden sm:flex flex-col pt-20">
        {" "}
        {/* 👈 pt-20 added */}
        <Sidebar />
      </aside>

      {/* Main Content with top padding */}
      <main className="flex-1 p-6 pt-20 overflow-auto">
        {" "}
        {/* 👈 pt-20 added */}
        <ToastContainer theme="dark" />
        {children}
      </main>
    </div>
  );
}
