"use client";
import Link from "next/link";

const ErrorPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center overflow-hidden">
      {/* Centered Error Message */}
      <section className="text-center">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="max-w-[530px] mx-auto">
            <h3 className="mb-4 text-3xl font-bold text-black sm:text-4xl">
              Sorry, the page can not be found
            </h3>
            <p className="mb-10 text-base font-medium leading-relaxed text-gray-600 sm:text-lg">
              The page you were looking for appears to have been moved, deleted,
              or does not exist.
            </p>
            <Link
              href="/"
              className="rounded-md bg-primary py-3 px-8 text-base font-bold text-white shadow-md transition duration-300 hover:bg-white hover:text-primary border border-primary"
            >
              Back to Homepage
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ErrorPage;
