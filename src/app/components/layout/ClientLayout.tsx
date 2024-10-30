import Header from "./Header";

export default function ClientLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<Header />

			{/* Main Content */}
			<main>{children}</main> {/* Adjust padding as needed */}
		</>
	);
}
