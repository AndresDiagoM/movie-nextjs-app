import Link from "next/link";
import { FaGithub, FaGlobe, FaLinkedin, FaTwitter } from "react-icons/fa";

export const Footer = () => {
  return (
    <>
      {/* Footer */}
      <footer className="relative bottom-0 pt-5 p-2 w-full flex flex-row flex-wrap gap-4 justify-center items-center text-sm">
        <a
          href="https://www.linkedin.com/in/andres-felipe-diago-matta/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-gray-400"
        >
          <FaLinkedin className="text-2xl" />
        </a>
        <a
          href="https://github.com/AndresDiagoM"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-gray-400"
        >
          <FaGithub className="text-2xl" />
        </a>
        <a
          href="https://andresdiagom.github.io/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-gray-400"
        >
          <FaGlobe className="text-2xl" />
        </a>
        <a
          href="https://x.com/AndresDmatta"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaTwitter className="text-2xl text-white" />
        </a>
        <span className="hidden md:inline-block h-5 w-px bg-gray-600" />
        <Link
          href="/privacy-policy"
          className="text-gray-400 hover:text-gray-200 underline"
        >
          Privacy Policy
        </Link>
      </footer>
    </>
  );
};
