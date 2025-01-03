"use client";

import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { FaSearch } from "react-icons/fa";
import { useSearchStore } from "app/stores/search";
import ShowsService from "app/services/showService";
import { useRouter } from "next/navigation";

export interface SearchBarRef {
    focus: () => void;
}

const SearchBar = forwardRef<SearchBarRef, object>((props, ref) => {
    const router = useRouter();
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const searchStore = useSearchStore();

    useImperativeHandle(ref, () => ({
        focus: () => {
            inputRef.current?.focus();
        }
    }));

    const handleSearchInput = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchValue = event.target.value;
        searchStore.setQuery(searchValue);

        if (searchValue.length > 2) {
            searchStore.setLoading(true);
            const data = await ShowsService.searchShows(searchValue);
            searchStore.setShows(data.results);
            searchStore.setLoading(false);
            
            // Redirect to search page after getting results
            router.push('/search');
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                searchStore.setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [searchRef, searchStore]);

    useEffect(() => {
        if (searchStore.isOpen) {
            // Focus the input when search is opened
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        }
    }, [searchStore.isOpen]);

    return (
        <div className="relative" ref={searchRef}>
            {!searchStore.isOpen && (
                <button
                    onClick={() => searchStore.setOpen(true)}
                    className="flex ml-0 bg-transparent text-black py-2 px-0 rounded-full"
                >
                    <FaSearch className="ml-2 w-full py-1 text-white" size="24px" />
                </button>
            )}
            {searchStore.isOpen && (
                <div className="flex ml-0 left-0 w-full bg-transparent">
                    <input
                        type="text"
                        ref={inputRef}
                        value={searchStore.query}
                        onChange={handleSearchInput}
                        placeholder="Search..."
                        className="w-full p-2 border border-gray-300 rounded text-black"
                    />
                </div>
            )}
        </div>
    );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;