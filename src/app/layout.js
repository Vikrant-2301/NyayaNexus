import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/blocks/Global/Navbar";
import { Footer } from "@/components/blocks/Global/Footer";
import PageWrapper from "@/components/PageWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Nyaya Nexus",
  description: "Empowering Legal Minds, Bridging Opportunities",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <PageWrapper>
          {children}
        </PageWrapper>
        <Footer />
      </body>
    </html>
  );
}
