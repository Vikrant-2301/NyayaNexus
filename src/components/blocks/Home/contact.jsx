"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Fade } from "react-awesome-reveal";

export const Contact = ({
  title = "Contact Us",
  description = "We are available for questions, feedback, or collaboration opportunities. Let us know how we can help!",
  phone = "+917982784180",
  email = "nyaya.nexus@gmail.com",
  web = { label: "Nyaya-nexus.com", url: "https://nyaya-nexus.com" },
}) => {
  return (
    <section
      id="contact"
      className="py-28 bg-neutral-50 dark:bg-neutral-900 px-4"
    >
      <div className="container mx-auto max-w-7xl">
        <Fade direction="up" cascade damping={0.1} triggerOnce>
          <div className="flex flex-col-reverse lg:flex-row justify-between gap-10">
            {/* Left Column */}
            <div className="w-full lg:max-w-md space-y-10">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl sm:text-5xl font-bold text-black dark:text-white mb-4">
                  {title}
                </h1>
                <p className="text-muted-foreground text-gray-700 dark:text-gray-400">
                  {description}
                </p>
              </div>

              <div className="w-full">
                <h3 className="text-2xl font-semibold mb-4 text-black dark:text-white">
                  Contact Details
                </h3>
                <ul className="space-y-3 text-gray-800 dark:text-gray-200">
                  <li>
                    <span className="font-medium">Phone:</span> {phone}
                  </li>
                  <li>
                    <span className="font-medium">Email:</span>{" "}
                    <Link
                      href={`mailto:${email}`}
                      className="underline text-primary hover:text-primary/80"
                    >
                      {email}
                    </Link>
                  </li>
                  <li>
                    <span className="font-medium">Website:</span>{" "}
                    <Link
                      href={web.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-primary hover:text-primary/80"
                    >
                      {web.label}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <form className="w-full max-w-2xl mx-auto lg:mx-0 bg-white dark:bg-neutral-800 p-8 rounded-lg shadow-md space-y-6">
              <h3 className="text-2xl font-semibold text-black dark:text-white">
                Send Us a Message
              </h3>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full">
                  <Label
                    htmlFor="firstname"
                    className="text-sm text-black dark:text-white"
                  >
                    First Name
                  </Label>
                  <Input
                    type="text"
                    id="firstname"
                    placeholder="First Name"
                    className="border-gray-300 dark:border-gray-600"
                    required
                  />
                </div>
                <div className="w-full">
                  <Label
                    htmlFor="lastname"
                    className="text-sm text-black dark:text-white"
                  >
                    Last Name
                  </Label>
                  <Input
                    type="text"
                    id="lastname"
                    placeholder="Last Name"
                    className="border-gray-300 dark:border-gray-600"
                    required
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="email"
                  className="text-sm text-black dark:text-white"
                >
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  className="border-gray-300 dark:border-gray-600"
                  required
                />
              </div>

              <div>
                <Label
                  htmlFor="subject"
                  className="text-sm text-black dark:text-white"
                >
                  Subject
                </Label>
                <Input
                  type="text"
                  id="subject"
                  placeholder="What's this about?"
                  className="border-gray-300 dark:border-gray-600"
                />
              </div>

              <div>
                <Label
                  htmlFor="message"
                  className="text-sm text-black dark:text-white"
                >
                  Message
                </Label>
                <Textarea
                  id="message"
                  rows={5}
                  placeholder="Type your message here..."
                  className="border-gray-300 dark:border-gray-600"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary text-white hover:bg-primary/90"
              >
                Send Message
              </Button>
            </form>
          </div>
        </Fade>
      </div>
    </section>
  );
};
