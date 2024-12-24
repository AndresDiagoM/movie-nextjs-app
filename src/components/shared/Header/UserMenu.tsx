import { useState } from 'react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';

interface UserMenuProps {
    userName: string;
    userImage?: string | null;
}

export default function UserMenu({ userName, userImage }: UserMenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                className="flex items-center space-x-2 rounded-full hover:opacity-80"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                    {userImage ? (
                        <Image
                            src={userImage}
                            alt={userName}
                            width={32}
                            height={32}
                            className="rounded-full"
                        />
                    ) : (
                        <span className="text-sm font-medium">{userName[0]}</span>
                    )}
                </div>
                <span className="hidden md:inline">{userName}</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-black/90 rounded-lg shadow-lg py-1">
                    <button
                        onClick={() => signOut()}
                        className="block px-4 py-2 text-sm text-white hover:bg-white/10 w-full text-left"
                    >
                        Sign out
                    </button>
                </div>
            )}
        </div>
    );
}
