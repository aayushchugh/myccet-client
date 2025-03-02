"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function DynamicBreadcrumb() {
	const pathname = usePathname();
	const pathSegments = pathname.split("/").filter(Boolean);

	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink asChild>
						<Link href="/">Dashboard</Link>
					</BreadcrumbLink>
				</BreadcrumbItem>

				{pathSegments.map((segment, index) => {
					const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
					const isLast = index === pathSegments.length - 1;
					const formattedSegment = segment.charAt(0).toUpperCase() + segment.slice(1);

					return (
						<React.Fragment key={href}>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								{isLast ? (
									<BreadcrumbPage>{formattedSegment}</BreadcrumbPage>
								) : (
									<BreadcrumbLink asChild>
										<Link href={href}>{formattedSegment}</Link>
									</BreadcrumbLink>
								)}
							</BreadcrumbItem>
						</React.Fragment>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
