"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { X } from "lucide-react";

const navItems = [
  { title: "Home", href: "/" },
  { title: "About", href: "/#about" },
  { title: "Features", href: "/#features" },
  { title: "Articles", href: "/#articles" },
  { title: "Submit Article", href: "/submit-article" },
  { title: "Contact", href: "/#contact" },
];

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  const closeSheet = () => setIsOpen(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button aria-label="Open Navigation Menu" className="text-white">
          <HamburgerMenuIcon className="w-6 h-6 mx-2" />
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="bg-black/20 backdrop-blur-lg border-l border-white/20 text-white p-6 rounded-l-2xl"
      >
        {/* Custom X Button (No blue box) */}
        <button
          onClick={closeSheet}
          aria-label="Close menu"
          className="absolute right-4 top-4 text-white hover:text-gray-300 transition duration-200 focus:outline-none"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Menu Items */}
        <div className="flex flex-col h-full pt-16">
          <nav className="flex flex-col space-y-6">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                onClick={() => {
                  closeSheet();
                  setActiveIndex(index);
                }}
                className={`text-lg font-medium tracking-wide px-3 py-2 rounded-md transition-all duration-150 ${
                  activeIndex === index
                    ? "bg-white text-black"
                    : "hover:bg-white/10 text-white"
                }`}
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="mt-auto pt-8 border-t border-white/10 text-sm text-white/60 text-center">
            © {new Date().getFullYear()} Nyaya Nexus
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
