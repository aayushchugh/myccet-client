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
	subject_code: number;
	subject_name: string;
}

const data: TableRowData[] = [
	{
		subject_code: 5234,
		subject_name: "Mathematics",
	},
	{
		subject_code: 5234,
		subject_name: "Mathematics",
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
						<TableHead className="w-[50%]">Subject Code</TableHead>
						<TableHead className="w-[50%] text-right te">Subject Name</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{currentRows.map((row, index) => (
						<TableRow key={index}>
							<TableCell className="font-medium">{row.subject_code}</TableCell>
							<TableCell className="text-right">{row.subject_name}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<div className=" mt-10">
				<Pagination>
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
								onClick={() =>
									handlePageChange(Math.min(currentPage + 1, totalPages))
								}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</div>
		</div>
	);
}
