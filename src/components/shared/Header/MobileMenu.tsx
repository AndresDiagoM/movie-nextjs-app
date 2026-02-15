"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaBars, FaSignInAlt, FaTimes } from "react-icons/fa";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    if (pathname !== "/search") {
      setIsOpen(false);
    }
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Focus search input after animation completes
      setTimeout(() => {
        searchRef.current?.focus();
      }, 300);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-[99999] p-2 text-white hover:text-gray-300 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 z-[99997] ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Menu Panel */}
      <div
        className={`fixed inset-y-0 right-0 w-[80%] max-w-sm bg-black/95 shadow-lg transform transition-transform duration-300 ease-in-out z-[99998] ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full pt-20 pb-6 px-6">
          <div className="flex-1 space-y-6">
            <SearchBar ref={searchRef} />
            <nav className="space-y-8">
              <Link
                href="/home"
                onClick={() => setIsOpen(false)}
                className="block text-lg hover:text-gray-300 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/movies"
                onClick={() => setIsOpen(false)}
                className="block text-lg hover:text-gray-300 transition-colors"
              >
                Movies
              </Link>
              <Link
                href="/series"
                onClick={() => setIsOpen(false)}
                className="block text-lg hover:text-gray-300 transition-colors"
              >
                Series
              </Link>
              <Link
                href="/trending"
                onClick={() => setIsOpen(false)}
                className="block text-lg hover:text-gray-300 transition-colors"
              >
                Trending
              </Link>
            </nav>
          </div>
          <div className="mt-auto">
            {session ? (
              <UserMenu
                userName={session.user?.name || "User"}
                userImage={session.user?.image}
              />
            ) : (
              <Link
                href="/auth/signin"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center w-full bg-white text-black py-3 px-6 rounded-full hover:bg-gray-200 transition-colors"
              >
                Login
                <FaSignInAlt className="ml-2" size="20px" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
