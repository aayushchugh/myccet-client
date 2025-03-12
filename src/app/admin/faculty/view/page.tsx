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
import { Button } from "@/components/ui";
import Link from "next/link";
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
		subject: "Physics",
	},
	{
		registrationNumber: "220099510650",
		name: "Jane Smith",
		department: "ECE",
		subject: "Mathematics",
	},
	{
		registrationNumber: "220099510651",
		name: "Alice Johnson",
		department: "ME",
		subject: "Thermodynamics",
	},
];

export default function FacultyList() {
	const [currentPage, setCurrentPage] = useState(1);
	const [search, setSearch] = useState("");
	const rowsPerPage = 10;

	const filteredData = data.filter((row) =>
		`${row.registrationNumber} ${row.name} ${row.department} ${row.subject}`
			.toLowerCase()
			.includes(search.toLowerCase()),
	);

	const totalPages = Math.ceil(filteredData.length / rowsPerPage);
	const currentRows = filteredData.slice(
		(currentPage - 1) * rowsPerPage,
		currentPage * rowsPerPage,
	);

	const handlePageChange = (page: number): void => setCurrentPage(page);

	return (
		<div className="w-full px-4">
			<div className="flex justify-end">
				<Link href={"/admin/faculty/create"}>
					<Button className="w-auto right-0">Register Faculty</Button>
				</Link>
			</div>

			<input
				type="text"
				value={search}
				onChange={(e) => {
					setSearch(e.target.value);
					setCurrentPage(1);
				}}
				placeholder="Search..."
				className="w-full mb-4 p-2 border border-gray-300 rounded-md"
			/>

			<Table className="w-full">
				<TableHeader>
					<TableRow>
						<TableHead className="w-[25%]">Registration Number</TableHead>
						<TableHead className="w-[25%]">Name</TableHead>
						<TableHead className="w-[25%]">Department</TableHead>
						<TableHead className="w-[25%]">Subject</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{currentRows.length > 0 ? (
						currentRows.map((row, index) => (
							<TableRow key={index}>
								<TableCell className="font-medium">
									{row.registrationNumber}
								</TableCell>
								<TableCell>{row.name}</TableCell>
								<TableCell>{row.department}</TableCell>
								<TableCell>{row.subject}</TableCell>
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={4} className="text-center py-4">
								No records found
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>

			{/* Pagination */}
			{totalPages > 1 && (
				<Pagination className="mt-10">
					<PaginationContent>
						{/* Previous Button */}
						<PaginationItem>
							<PaginationPrevious
								href="#"
								onClick={() => handlePageChange(currentPage - 1)}
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
								onClick={() => handlePageChange(currentPage + 1)}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			)}
		</div>
	);
}
