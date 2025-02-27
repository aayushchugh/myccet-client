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
	registrationNumber: string;
	name: string;
	department: string;
	subject: string;
}

const data: TableRowData[] = [
	{
		registrationNumber: "220099510649",
		name: "John Doe",
		department: "CSE",
		subject: "physics",
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
						<TableHead className="w-[25%]">Name</TableHead>
						<TableHead className="w-[25%]">Designation</TableHead>
						<TableHead className="w-[25%] text-right">Created By</TableHead>
						<TableHead className="w-[25%] text-right">Created On</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{currentRows.map((row, index) => (
						<TableRow key={index}>
							<TableCell className="font-medium">{row.registrationNumber}</TableCell>
							<TableCell>{row.name}</TableCell>
							<TableCell className="text-right">{row.department}</TableCell>
							<TableCell className="text-right">{row.subject}</TableCell>
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
