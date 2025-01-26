export default function AdminLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div>
			<h1>Admin layout</h1>
			{children}
		</div>
	);
}
