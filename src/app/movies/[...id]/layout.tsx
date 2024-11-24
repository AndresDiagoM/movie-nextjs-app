// import Link from "next/link";

export default function Layout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<main>
			{/* <nav>
				<ul>
					<li>
						<Link href="/">Navegación de movies ID</Link>
					</li>
				</ul>
			</nav> */}
			{/* return children, its the content of the page */}
			{children}
		</main>
	);
}
