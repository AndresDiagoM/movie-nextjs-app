"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaSignInAlt } from "react-icons/fa";
import MobileMenu from "./MobileMenu";
import { isActive, NAV_LINKS } from "./navLinks";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";

export const Header = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  // See-through over the top of the page, solid once content scrolls under it.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // console.log(session);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 text-white transition-colors duration-300 ${
        scrolled
          ? "bg-black/90 backdrop-blur-md"
          : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <nav className="flex items-center justify-between p-4 lg:p-6 w-full max-w-6xl mx-auto">
        {/* Logo - visible on all screens */}
        <Link href="/" className="relative z-50">
          <h1 className="text-xl font-bold">Sudo-Flix</h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-between flex-1 ml-10">
          <ul className="flex items-center space-x-8">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center gap-2 transition-colors ${
                    isActive(pathname, link.href)
                      ? "text-white font-semibold"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {link.live && (
                    <span className="h-2 w-2 rounded-full bg-[#ff3b30] shadow-[0_0_8px_#ff3b30] animate-pulse" />
                  )}
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center space-x-6">
            <SearchBar />
            {session ? (
              <UserMenu
                userName={session.user?.name || "User"}
                userImage={session.user?.image}
              />
            ) : (
              <Link
                href="/auth/signin"
                className="flex items-center bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200 transition-colors"
              >
                Login
                <FaSignInAlt className="ml-2" size="20px" />
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden">
          <MobileMenu />
        </div>
      </nav>
    </header>
  );
};
