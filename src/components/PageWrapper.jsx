"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Loader from "./Loader";

const PageWrapper = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // Adjust duration as needed

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {loading && <Loader />}
      {children}
    </>
  );
};

export default PageWrapper;
