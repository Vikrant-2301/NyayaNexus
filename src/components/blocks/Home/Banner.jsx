"use client";
import Image from "next/image";
import { Fade } from "react-awesome-reveal";
import { Button } from "@/components/ui/button";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";

const Banner = () => {
  return (
    <HeroGeometric
      title1="Empowering Legal Minds"
      title2="Bridging Opportunities"
    />
  );
};

export default Banner;
