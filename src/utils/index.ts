import { Show } from "../types";

export function getRandomMovieFromList(list: Show[]): Show | undefined {
	const randomIndex = Math.floor(Math.random() * list.length);
	const randomMovie = list[randomIndex];
	return randomMovie;
}
