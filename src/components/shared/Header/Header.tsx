import Link from "next/link";
import { FaSignInAlt } from "react-icons/fa";
import SearchBar from "./SearchBar";
import MobileMenu from "./MobileMenu";

export const Header = () => {
    return (
        <header className="fixed top-0 left-0 w-full z-20 text-white bg-gradient-to-b from-black/80 to-transparent">
            <nav className="flex items-center justify-between p-4 lg:p-6 w-full max-w-6xl mx-auto">
                {/* Logo - visible on all screens */}
                <Link href="/" className="relative z-50">
                    <h1 className="text-xl font-bold">Sudo-Flix</h1>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center justify-between flex-1 ml-10">
                    <ul className="flex items-center space-x-8">
                        <li><Link href="/home" className="hover:text-gray-300 transition-colors">Home</Link></li>
                        <li><Link href="/movies" className="hover:text-gray-300 transition-colors">Movies</Link></li>
                        <li><Link href="/series" className="hover:text-gray-300 transition-colors">Series</Link></li>
                        <li><Link href="/trending" className="hover:text-gray-300 transition-colors">Trending</Link></li>
                    </ul>
                    
                    <div className="flex items-center space-x-6">
                        <SearchBar />
                        <a href="#login" className="flex items-center bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200 transition-colors">
                            Login
                            <FaSignInAlt className="ml-2" size="20px" />
                        </a>
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
