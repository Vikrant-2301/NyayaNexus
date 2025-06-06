import { Button } from "@/components/ui/button";
import { IconBrandWhatsapp } from "@tabler/icons-react";
import { Twitter, Github, Instagram, MessageCircle } from "lucide-react"; // ✅ Make sure Twitter is imported

export function Footer({
  logo = null,
  brandName = "Nyaya Nexus",
  socialLinks = [
    {
      icon: <IconBrandWhatsapp className="h-5 w-5" />,
      href: "https://whatsapp.com",
      label: "Twitter",
    },
    {
      icon: <Twitter className="h-5 w-5" />,
      href: "https://x.com",
      label: "Twitter",
    },
    {
      icon: <Instagram className="h-5 w-5" />,
      href: "https://instagram.com",
      label: "Instagram",
    },
  ],
  mainLinks = [
    { href: "/#about", label: "About" },
    { href: "/#features", label: "Features" },
    { href: "/#contact", label: "Contact" },
  ],
  legalLinks = [
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
  ],
  copyright = {
    text: "© 2025 Nyaya Nexus",
    license: "All rights reserved",
  },
}) {
  return (
    <footer className="pb-6 pt-16 lg:pb-8 lg:pt-24">
      <div className="px-4 lg:px-8">
        <div className="md:flex md:items-start md:justify-between">
          <a
            href="/"
            className="flex items-center gap-x-2"
            aria-label={brandName}
          >
            {logo}
            <span className="font-bold text-xl">{brandName}</span>
          </a>
          <ul className="flex list-none mt-6 md:mt-0 space-x-3">
            {socialLinks.map((link, i) => (
              <li key={i}>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  asChild
                >
                  <a href={link.href} target="_blank" aria-label={link.label}>
                    {link.icon}
                  </a>
                </Button>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t mt-6 pt-6 md:mt-4 md:pt-8 lg:grid lg:grid-cols-10">
          <nav className="lg:mt-0 lg:col-[4/11]">
            <ul className="list-none flex flex-wrap -my-1 -mx-2 lg:justify-end">
              {mainLinks.map((link, i) => (
                <li key={i} className="my-1 mx-2 shrink-0">
                  <a
                    href={link.href}
                    className="text-sm text-primary underline-offset-4 hover:underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-6 lg:mt-0 lg:col-[4/11]">
            <ul className="list-none flex flex-wrap -my-1 -mx-3 lg:justify-end">
              {legalLinks.map((link, i) => (
                <li key={i} className="my-1 mx-3 shrink-0">
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 text-sm leading-6 text-muted-foreground whitespace-nowrap lg:mt-0 lg:row-[1/3] lg:col-[1/4]">
            <div>{copyright.text || "© Your Brand"}</div>
            {copyright.license && <div>{copyright.license}</div>}
          </div>
        </div>
      </div>
    </footer>
  );
}
