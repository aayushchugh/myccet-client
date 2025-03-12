import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layouts/layout";
import { DynamicBreadcrumb } from "@/components/layouts/breadcrumb";

export default function AdminLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div>
			<SidebarProvider>
				<AppSidebar />
				<main className="flex-1 px-10 pt-4">
					{/* <SidebarTrigger /> */}
					<DynamicBreadcrumb />
					<div className="pt-4">{children}</div>
				</main>
			</SidebarProvider>
		</div>
	);
}
