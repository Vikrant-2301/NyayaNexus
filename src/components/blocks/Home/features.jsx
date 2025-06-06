"use client";
import { cn } from "@/lib/utils";
import {
  IconBriefcase,
  IconFileText,
  IconMicrophone,
  IconHeartHandshake,
  IconUsersGroup,
  IconTargetArrow,
  IconCertificate,
  IconScale,
} from "@tabler/icons-react";
import { Fade } from "react-awesome-reveal";

export function FeaturesSectionWithHoverEffects() {
  const features = [
    {
      title: "Legal Internships",
      description:
        "Get placed with law firms, advocates, and organizations to gain practical experience.",
      icon: <IconBriefcase size={32} className="text-primary" />,
    },
    {
      title: "Article Publications",
      description:
        "Publish your legal research and opinions through journals and blog posts.",
      icon: <IconFileText size={32} className="text-primary" />,
    },
    {
      title: "Moot & Debate Competitions",
      description:
        "Hone your advocacy skills through regular national-level events.",
      icon: <IconMicrophone size={32} className="text-primary" />,
    },
    {
      title: "Social Welfare Programs",
      description:
        "Engage in grassroots legal awareness and pro bono legal campaigns.",
      icon: <IconHeartHandshake size={32} className="text-primary" />,
    },
    {
      title: "Community & Networking",
      description:
        "Connect with law students, mentors, and legal professionals.",
      icon: <IconUsersGroup size={32} className="text-primary" />,
    },
    {
      title: "Skill Development",
      description:
        "Workshops and bootcamps to boost research, drafting, and courtroom skills.",
      icon: <IconTargetArrow size={32} className="text-primary" />,
    },
    {
      title: "Certifications",
      description:
        "Earn verifiable certificates that strengthen your legal resume.",
      icon: <IconCertificate size={32} className="text-primary" />,
    },
    {
      title: "Legal Resources",
      description:
        "Access case studies, judgments, notes, and preparation material.",
      icon: <IconScale size={32} className="text-primary" />,
    },
  ];

  return (
    <section className="bg-white py-24 px-6 md:px-10 lg:px-20" id="features">
      <div className="max-w-7xl mx-auto">
        <Fade direction="up" cascade damping={0.1} triggerOnce>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-black">
              Explore Our <span className="text-primary">Key Offerings</span>
            </h2>
            <p className="text-lg text-gray-700 mt-4 max-w-2xl mx-auto">
              Nyaya Nexus bridges the gap between education and real-world law
              by offering opportunities that build skills, credibility, and
              community.
            </p>
          </div>
        </Fade>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-200 dark:bg-neutral-800 rounded-lg overflow-hidden">
          {features.map((feature, index) => (
            <Feature key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

const Feature = ({ title, description, icon, index }) => {
  return (
    <div
      className={cn(
        "flex flex-col py-10 relative group/feature bg-white dark:bg-neutral-900 hover:bg-neutral-50 transition-all duration-200"
      )}
    >
      {/* Background hover overlay */}
      <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />

      {/* Icon */}
      <div className="mb-4 relative z-10 px-10">{icon}</div>

      {/* Title with bar */}
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-primary transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
