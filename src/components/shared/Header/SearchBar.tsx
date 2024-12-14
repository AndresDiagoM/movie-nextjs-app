"use client";

import { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = () => {
	const [showSearch, setShowSearch] = useState(false);
	const searchRef = useRef<HTMLDivElement>(null);

	const handleClickOutside = (event: MouseEvent) => {
		if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
			setShowSearch(false);
		}
	};

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div className="relative" ref={searchRef}>
			{!showSearch && (
				<button
					onClick={() => setShowSearch(!showSearch)}
					className="flex ml-4 bg-transparent text-black py-2 px-4 rounded-full"
				>
					<FaSearch className="ml-2 w-full py-1 text-white" size="24px" />
				</button>
			)}
			{showSearch && (
				<div className="flex ml-4 left-0 w-full bg-transparent">
					<input
						type="text"
						placeholder="Search..."
						className="w-full p-2 border border-gray-300 rounded text-black"
					/>
				</div>
			)}
		</div>
	);
};

export default SearchBar;
