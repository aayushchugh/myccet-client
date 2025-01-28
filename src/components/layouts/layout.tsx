import { NotebookPen, GraduationCap, UserRoundPen, Album } from "lucide-react";

import {
	Sidebar,
	SidebarContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Menu items.
const items = [
	{
		title: "Faculty",
		url: "#",
		icon: UserRoundPen,
	},
	{
		title: "Student",
		url: "#",
		icon: GraduationCap,
	},
	{
		title: "Subject ",
		url: "#",
		icon: NotebookPen,
	},
	{
		title: "Branch",
		url: "#",
		icon: Album,
	},
];

export function AppSidebar() {
	return (
		<Sidebar>
			<SidebarContent>
				{/* Top Image */}
				<div className="p-6 text-center">
					<img
						src="/logo.svg"
						alt="Logo"
						className="mx-auto h-32" // Increased width and height
					/>
					<h2 className="text-2xl font-bold ">MY CCET</h2> {/* Adjusted font size */}
				</div>

				{/* Navigation Menu */}
				<div className="pl-4">
					<SidebarMenu>
						{items.map((item) => (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton asChild>
									<a href={item.url} className="flex items-center space-x-2">
										<item.icon />
										<span>{item.title}</span>
									</a>
								</SidebarMenuButton>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</div>
			</SidebarContent>
			<SidebarFooter>
				<div className="flex items-center space-x-3 p-4">
					<Avatar>
						<AvatarImage src="/logo.svg" />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>

					<div>
						<p className="text-sm font-medium">Username</p>
						<p className="text-xs text-muted-foreground">@Username</p>
					</div>
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}
