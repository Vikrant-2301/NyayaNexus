"use client";
import Image from "next/image";
import { IconTarget, IconScale, IconUsersGroup } from "@tabler/icons-react";
import { Fade } from "react-awesome-reveal";

const AboutSection = () => {
  return (
    <section id="about" className="bg-gray-50 py-24 px-6 md:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: Content */}
        <div>
          <Fade direction="up" cascade damping={0.1} triggerOnce>
            <h2 className="text-5xl font-bold text-black mb-6 leading-tight">
              Empowering Legal Minds, <br />
              <span className="text-primary">Bridging Opportunities</span>
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              <strong>Nyaya Nexus</strong> is a transformative legal platform
              focused on connecting law students to real-world experiences. We
              help future professionals grow through active engagement,
              mentorship, and curated opportunities that matter.
            </p>
          </Fade>

          {/* Pillars */}
          <div className="space-y-6">
            <Fade direction="up" cascade damping={0.15} triggerOnce>
              <div className="flex items-start gap-4">
                <IconTarget size={36} className="text-primary mt-1" />
                <div>
                  <h4 className="text-xl font-semibold text-black">
                    Purpose-Driven
                  </h4>
                  <p className="text-gray-600">
                    We guide every step with meaningful impact in mind.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <IconScale size={36} className="text-primary mt-1" />
                <div>
                  <h4 className="text-xl font-semibold text-black">
                    Justice-Oriented
                  </h4>
                  <p className="text-gray-600">
                    Rooted in legal ethics and fairness for all.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <IconUsersGroup size={36} className="text-primary mt-1" />
                <div>
                  <h4 className="text-xl font-semibold text-black">
                    Student-Centric
                  </h4>
                  <p className="text-gray-600">
                    Focused on the growth and success of legal students.
                  </p>
                </div>
              </div>
            </Fade>
          </div>
        </div>

        {/* Right: Illustration */}
        <Fade direction="right" triggerOnce>
          <div className="flex justify-center">
            <Image
              src="/assets/about.svg"
              alt="Justice Illustration"
              width={500}
              height={500}
              className="object-contain drop-shadow-md"
            />
          </div>
        </Fade>
      </div>
    </section>
  );
};

export default AboutSection;
