export default function Layout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<div className="w-full h-full min-h-screen overflow-y-auto relative">
			{children}
		</div>
	);
}

