import Image from "next/image";

export const TrendingMovies = () => {
	return (
		<div className="flex flex-col items-center justify-center">
			<h1 className="text-4xl font-bold">Trending Now</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				<div className="flex flex-col items-center justify-center">
					<Image
						src="https://image.tmdb.org/t/p/w500/6MKr3KgOLmzOP6MSuZERO41Lpkt.jpg"
						alt="Movie"
						className="rounded-lg"
						width={500}
						height={750}
					/>
					<h2 className="text-lg font-semibold">Movie Title</h2>
				</div>
				<div className="flex flex-col items-center justify-center">
					<Image
						src="https://image.tmdb.org/t/p/w500/6MKr3KgOLmzOP6MSuZERO41Lpkt.jpg"
						alt="Movie"
						className="rounded-lg"
						width={500}
						height={750}
					/>
					<h2 className="text-lg font-semibold">Movie Title</h2>
				</div>
				<div className="flex flex-col items-center justify-center">
					<Image
						src="https://image.tmdb.org/t/p/w500/6MKr3KgOLmzOP6MSuZERO41Lpkt.jpg"
						alt="Movie"
						className="rounded-lg"
						width={500}
						height={750}
					/>
					<h2 className="text-lg font-semibold">Movie Title</h2>
				</div>
				<div className="flex flex-col items-center justify-center">
					<Image
						src="https://image.tmdb.org/t/p/w500/6MKr3KgOLmzOP6MSuZERO41Lpkt.jpg"
						alt="Movie"
						className="rounded-lg"
						width={500}
						height={750}
					/>
					<h2 className="text-lg font-semibold">Movie Title</h2>
				</div>
			</div>
		</div>
	);
};
