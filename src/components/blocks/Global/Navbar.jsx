"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { NavigationItems } from "./NaviagtionItems";
import MobileNav from "@/components/MobileNav/page";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className="flex items-center justify-center">
      <div
        className={`fixed top-5 z-50 w-[94%] max-w-[1461px] mx-auto flex justify-between items-center
        px-4 sm:px-8 h-14 sm:h-16 rounded-2xl transition-all duration-500 ease-in-out
        shadow-md backdrop-blur-lg border border-white/20
        ${scrolled ? "bg-black/30" : "bg-black/20"} 
        text-white`}
      >
        {/* Logo */}
        <div className="flex space-x-4 sm:space-x-8">
          <Link href="/" className="flex items-center space-x-2" id="logo">
            <Image
              src="/Logo.svg"
              alt="Nyaya Nexus Logo"
              width={36}
              height={36}
              priority
              className="h-9 w-9 object-contain"
            />
            <p className="font-semibold text-sm sm:text-base drop-shadow-sm">
              Nyaya Nexus
            </p>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:block">
          <div className="text-white drop-shadow-sm">
            <NavigationItems />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden flex items-center">
          <div className="text-white drop-shadow-sm">
            <MobileNav />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
