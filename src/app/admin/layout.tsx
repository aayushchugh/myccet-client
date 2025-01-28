import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layouts/layout";

export default function AdminLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div>
			<SidebarProvider>
				<AppSidebar />
				<main>
					<SidebarTrigger />

					{children}
				</main>
			</SidebarProvider>
		</div>
	);
}
