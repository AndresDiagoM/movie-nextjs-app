import { create } from 'zustand';
import { clearSearch } from '@/utils';
import type { Show, Genre } from '@/types';

interface SearchState {
	query: string;
	setQuery: (query: string) => void;
	shows: Show[];
	setShows: (shows: Show[]) => void;
	isOpen: boolean;
	setOpen: (value: boolean) => void;
	loading: boolean;
	setLoading: (value: boolean) => void;
	reset: () => void;

	genres: Genre[];
	setGenres: (genres: Genre[]) => void;
}

export const useSearchStore = create<SearchState>()((set) => ({
	query: "",
	setQuery: (query: string) => set(() => ({ query })),
	shows: [],
	setShows: (shows: Show[]) => set(() => ({ shows })),
	isOpen: false,
	setOpen: (value: boolean) => set(() => ({ isOpen: value })),
	loading: true,
	setLoading: (value: boolean) => set(() => ({ loading: value })),
	reset: () =>
		set(() => {
			clearSearch();
			return { query: "", shows: [], loading: false };
		}),
	genres: [],
	setGenres: (genres: Genre[]) => set(() => ({ genres })),
}));
