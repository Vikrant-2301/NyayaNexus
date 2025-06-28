"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const navItems = [
  { title: "Home", href: "/" },
  { title: "About", href: "/#about" },
  { title: "Features", href: "/#features" },
  { title: "Articles", href: "/#articles" },
  { title: "Submit Article", href: "/submit-article" },
  { title: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Prevent scroll when drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Navbar */}
      <nav className="flex items-center justify-center">
        <div
          className={`fixed top-5 z-50 w-[94%] max-w-[1461px] mx-auto flex justify-between items-center
          px-4 sm:px-8 h-14 sm:h-16 rounded-2xl transition-all duration-500 ease-in-out
          shadow-md backdrop-blur-lg border border-white/20
          ${scrolled ? "bg-black/30" : "bg-black/20"} text-white`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/Logo.svg"
              alt="Nyaya Nexus Logo"
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
            />
            <span className="font-semibold text-sm sm:text-base drop-shadow-sm">
              Nyaya Nexus
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex space-x-6 text-sm font-medium">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="hover:text-gray-300 transition"
              >
                {item.title}
              </Link>
            ))}
          </div>

          {/* Mobile Nav Trigger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden"
            aria-label="Open mobile menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer (Right-to-Left, 80vw) */}
      <div
        className={`fixed top-0 right-0 z-[999] h-full w-[80vw] bg-black/80 backdrop-blur-lg text-white 
        transform transition-transform duration-300 ease-in-out border-l border-white/20 p-6 
        ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center space-x-2">
            <Image
              src="/Logo.svg"
              alt="Nyaya Nexus Logo"
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
            />
            <span className="font-semibold text-lg">Nyaya Nexus</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="text-white hover:text-gray-300 focus:outline-none"
            aria-label="Close mobile menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Nav Items */}
        <div className="flex flex-col space-y-6 text-lg font-medium">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-gray-300 transition"
            >
              {item.title}
            </Link>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-auto pt-12 text-sm text-white/60 text-center border-t border-white/10">
          © {new Date().getFullYear()} Nyaya Nexus
        </footer>
      </div>

      {/* Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed top-0 left-0 right-[20vw] bottom-0 z-[998] bg-black/20"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
