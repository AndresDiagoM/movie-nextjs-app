// import Link from "next/link";
import "app/sass/globals.sass";

export default function Layout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<main className="pt-20">
			{/* <nav>
				<ul>
					<li>
						<Link href="/">Navegación de home</Link>
					</li>
				</ul>
			</nav> */}
			{/* return children, its the content of the page */}
			{children}
		</main>
	);
}
