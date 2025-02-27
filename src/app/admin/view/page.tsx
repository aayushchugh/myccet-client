"use client";
import { useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
interface TableRowData {
	email: string;
	name: string;
	designation: string;
	subject: string;
	createdBy: string;
}

const data: TableRowData[] = [
	{
		email: "hey@adityapant.com",
		name: "John Doe",
		designation: "HOD",
		subject: "physics",
		createdBy: "Aditya",
	},
];

export default function TableDemo() {
	const [currentPage, SelectCurrentPage] = useState(1);
	const rowsPerPage = 17;

	const totalPages: number = Math.ceil(data.length / rowsPerPage);

	const currentRows: TableRowData[] = data.slice(
		(currentPage - 1) * rowsPerPage,
		currentPage * rowsPerPage,
	);
	const handlePageChange = (page: number): void => {
		SelectCurrentPage(page);
	};
	return (
		<div className="w-full px-4">
			<Table className="w-full ">
				<TableHeader>
					<TableRow>
						<TableHead className="w-[25%] ">Email Address</TableHead>
						<TableHead className="w-[25%] text-right">Name</TableHead>
						<TableHead className="w-[25%] text-right">Designation</TableHead>
						<TableHead className="w-[25%] text-right">Created By</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{currentRows.map((row, index) => (
						<TableRow key={index}>
							<TableCell className="">{row.email}</TableCell>
							<TableCell className="text-right">{row.name}</TableCell>
							<TableCell className="text-right">{row.designation}</TableCell>
							<TableCell className="text-right">{row.designation}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			<Pagination className="mt-10">
				<PaginationContent>
					{/* Previous Button */}
					<PaginationItem>
						<PaginationPrevious
							href="#"
							onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
						/>
					</PaginationItem>

					{/* Page Numbers */}
					{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
						<PaginationItem key={page}>
							<PaginationLink
								href="#"
								isActive={page === currentPage}
								onClick={() => handlePageChange(page)}
							>
								{page}
							</PaginationLink>
						</PaginationItem>
					))}

					{/* Next Button */}
					<PaginationItem>
						<PaginationNext
							href="#"
							onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</div>
	);
}
