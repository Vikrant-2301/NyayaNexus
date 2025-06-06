"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { NavigationItems } from "./NaviagtionItems";
import MobileNav from "@/components/MobileNav/page";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > window.innerHeight / 2);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className="flex items-center justify-center">
      <div
        className={`fixed top-5 z-50 w-[94%] max-w-[1461px] mx-auto flex justify-between items-center
          px-4 sm:px-8 h-12 sm:h-14 backdrop-blur-md transition-colors duration-500 ease-in-out rounded-xl`}
        style={{
          backgroundColor: scrolled ? "rgba(33, 33, 33, 0.7)" : "transparent",
          color: "white",
          letterSpacing: "-0.16px",
          lineHeight: "24px",
        }}
      >
        {/* Logo */}
        <div className="flex space-x-4 sm:space-x-8">
          <Link href="/" className="flex items-center" id="logo">
            <p className="text-white font-medium text-sm sm:text-base">
              Nyaya Nexus
            </p>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:block">
          <NavigationItems />
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden flex justify-center items-center">
          <MobileNav />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
