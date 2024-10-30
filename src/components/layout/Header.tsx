import Link from "next/link";
import { FaSignInAlt } from "react-icons/fa";

export default function Header() {
	return (
		<>
			{/* Navigation */}
			<header className="absolute top-0 left-0 w-full z-10 text-center text-white bg-transparent">
				<nav
					className={`flex justify-between items-center p-6 w-full max-w-6xl mx-auto`}
				>
					<Link href="/">
						<h1 className="text-xl font-bold cursor-pointer">Sudo-Flix</h1>
					</Link>
					<ul className="flex space-x-6">
						<li>
							<Link href="/home" className="hover:underline">
								Home
							</Link>
						</li>
						<li>
							<Link href="/movies" className="hover:underline">
								Movies
							</Link>
						</li>
						<li>
							<Link href="/series" className="hover:underline">
								Series
							</Link>
						</li>
						<li>
							<Link href="/trending" className="hover:underline">
								Trending
							</Link>
						</li>
					</ul>
					<div className="flex space-x-4 items-center">
						<a
							href="#blocks"
							className="flex ml-4 bg-white text-black py-2 px-4 rounded-full hover:bg-gray-200"
						>
							Login
							<FaSignInAlt className="ml-2 w-full py-1" size="24px" />
						</a>
					</div>
				</nav>
			</header>
		</>
	);
}
