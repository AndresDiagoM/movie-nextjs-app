import { signOut } from "next-auth/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface UserMenuProps {
  userName: string;
  userImage?: string | null;
}

export default function UserMenu({ userName, userImage }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="flex items-center space-x-2 rounded-full hover:opacity-80 transition-opacity touch-manipulation"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-600 flex items-center justify-center">
          {userImage ? (
            <Image
              unoptimized
              src={userImage}
              alt={userName}
              width={40}
              height={40}
              className="rounded-full w-full h-full object-cover"
            />
          ) : (
            <span className="text-sm sm:text-base font-medium">
              {userName[0]}
            </span>
          )}
        </div>
        <span className="hidden md:inline text-sm lg:text-base">
          {userName}
        </span>
      </button>

      {isOpen && (
        <>
          {/* Mobile backdrop - only visible on mobile */}
          <div
            className="fixed inset-0 bg-black/20 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu dropdown */}
          <div className="absolute right-0 w-48 sm:w-56 bg-black/95 backdrop-blur-sm rounded-lg shadow-lg py-2 z-50 border border-gray-700 md:top-full md:mt-2 bottom-full mb-2 md:bottom-auto md:mb-0">
            <div className="px-4 py-3 border-b border-gray-700 md:hidden">
              <p className="text-sm font-medium text-white">{userName}</p>
              <p className="text-xs text-gray-400 truncate">Signed in</p>
            </div>

            <button
              onClick={() => {
                signOut();
                setIsOpen(false);
              }}
              className="block px-4 py-3 text-sm sm:text-base text-white hover:bg-white/10 w-full text-left transition-colors touch-manipulation"
            >
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
