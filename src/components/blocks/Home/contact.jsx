"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Fade } from "react-awesome-reveal";

export const Contact = ({
  title = "Contact Us",
  description = "We are available for questions, feedback, or collaboration opportunities. Let us know how we can help!",
  phone = "(123) 34567890",
  email = "nyayanexus@example.com",
  web = { label: "Nyaya-nexus.com", url: "https://nyaya-nexus.com" },
}) => {
  return (
    <section className="py-32 bg-neutral-50 dark:bg-neutral-900" id="contact">
      <div className="container mx-auto">
        <Fade direction="up" cascade damping={0.1} triggerOnce>
          <div className="mx-auto flex max-w-screen-xl flex-col justify-between gap-10 lg:flex-row lg:gap-20">
            {/* Left Column */}
            <div className="mx-auto flex max-w-sm flex-col justify-between gap-10">
              <div className="text-center lg:text-left">
                <h1 className="mb-2 text-5xl font-semibold lg:mb-1 lg:text-6xl text-black dark:text-white">
                  {title}
                </h1>
                <p className="text-muted-foreground text-gray-700 dark:text-gray-400">
                  {description}
                </p>
              </div>
              {/* Contact Details */}
              <div className="mx-auto w-fit lg:mx-0">
                <h3 className="mb-6 text-center text-2xl font-semibold lg:text-left text-black dark:text-white">
                  Contact Details
                </h3>
                <ul className="ml-4 list-disc text-gray-800 dark:text-gray-200">
                  <li>
                    <span className="font-bold">Phone: </span>
                    {phone}
                  </li>
                  <li>
                    <span className="font-bold">Email: </span>
                    <a
                      href={`mailto:${email}`}
                      className="underline text-primary hover:text-primary-dark"
                    >
                      {email}
                    </a>
                  </li>
                  <li>
                    <span className="font-bold">Web: </span>
                    <a
                      href={web.url}
                      target="_blank"
                      className="underline text-primary hover:text-primary-dark"
                    >
                      {web.label}
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="mx-auto flex max-w-screen-md flex-col gap-6 rounded-lg border p-10 bg-white dark:bg-neutral-800 shadow-lg">
              <h3 className="text-3xl font-semibold text-black dark:text-white mb-6">
                Send Us a Message
              </h3>

              {/* Form Fields */}
              <div className="flex gap-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label
                    htmlFor="firstname"
                    className="text-black dark:text-white"
                  >
                    First Name
                  </Label>
                  <Input
                    type="text"
                    id="firstname"
                    placeholder="First Name"
                    className="border-gray-300 dark:border-gray-600"
                  />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label
                    htmlFor="lastname"
                    className="text-black dark:text-white"
                  >
                    Last Name
                  </Label>
                  <Input
                    type="text"
                    id="lastname"
                    placeholder="Last Name"
                    className="border-gray-300 dark:border-gray-600"
                  />
                </div>
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="email" className="text-black dark:text-white">
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="Email"
                  className="border-gray-300 dark:border-gray-600"
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="subject" className="text-black dark:text-white">
                  Subject
                </Label>
                <Input
                  type="text"
                  id="subject"
                  placeholder="Subject"
                  className="border-gray-300 dark:border-gray-600"
                />
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="message" className="text-black dark:text-white">
                  Message
                </Label>
                <Textarea
                  placeholder="Type your message here."
                  id="message"
                  className="border-gray-300 dark:border-gray-600"
                />
              </div>

              <Button className="w-full mt-6 bg-primary hover:bg-primary-dark text-white">
                Send Message
              </Button>
            </div>
          </div>
        </Fade>
      </div>
    </section>
  );
};
