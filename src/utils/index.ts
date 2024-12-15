import { Show } from "../types";

export function getRandomMovieFromList(list: Show[]): Show | undefined {
	const randomIndex = Math.floor(Math.random() * list.length);
	const randomMovie = list[randomIndex];
	return randomMovie;
}

export function clearSearch(): void {
	const searchInput: HTMLInputElement | null = document.getElementById(
		"search-input"
	) as HTMLInputElement;
	searchInput.blur();
	searchInput.value = "";
	searchInput.defaultValue = "";
}
