"use client";

import { NotebookPen, GraduationCap, UserRoundPen, Shield, Album, ListTree } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
	Sidebar,
	SidebarContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import apiService from "@/services/api-service";
import Link from "next/link";

// Menu items.
const items = [
	{
		title: "Admin",
		url: "/admin/view",
		icon: Shield,
	},
	{
		title: "Faculty",
		url: "/admin/faculty",
		icon: UserRoundPen,
	},
	{
		title: "Student",
		url: "/admin/student",
		icon: GraduationCap,
	},
	{
		title: "Subject ",
		url: "/admin/subject",
		icon: NotebookPen,
	},
	{
		title: "Branch",
		url: "/admin/branch",
		icon: ListTree,
	},
	{
		title: "Semester",
		url: "/admin/semester",
		icon: Album,
	},
	{
		title: "Batch",
		url: "/admin/batch/view",
		icon: Album,
	},
];

export function AppSidebar() {
	const [username, setUsername] = useState("Loading...");
	const [designation, setDesignation] = useState("Loading...");

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const response = await apiService.get("/auth/me", { withCredentials: true });
				const userData = response.data.payload;
				if (userData) {
					setUsername(
						`${userData.first_name} ${userData.middle_name || ""} ${
							userData.last_name || ""
						}`.trim(),
					);
					setDesignation(userData.designation);
				}
			} catch (error) {
				console.error("Error fetching user data", error);
				setUsername("Unknown User");
				setDesignation("Unknown");
			}
		};
		fetchUserData();
		const handleUserUpdate = () => fetchUserData();
		window.addEventListener("userUpdated", handleUserUpdate);

		// Cleanup event listener on unmount
		return () => window.removeEventListener("userUpdated", handleUserUpdate);
	}, []);
	return (
		<Sidebar>
			<SidebarContent>
				{/* Top Image */}
				<div className="p-6 text-center">
					<Link href={`/admin`}>
						<Image
							src="/logo.svg"
							width={500}
							height={500}
							alt="Picture of the author"
							className="mx-auto h-32"
						/>
					</Link>
				</div>

				{/* Navigation Menu */}
				<div className="px-4">
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
					<Link href={`/admin/me`}>
						<div>
							<p className="text-sm font-medium">{username}</p>
							<p className="text-xs text-muted-foreground">{designation}</p>
						</div>
					</Link>
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}
