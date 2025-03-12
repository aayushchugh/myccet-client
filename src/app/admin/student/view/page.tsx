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
import Link from "next/link";
import { Button } from "@/components/ui";
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
	fathersName: string;
	semester: string;
	branch: string;
}

const data: TableRowData[] = [
	{
		registrationNumber: "220099510649",
		name: "John Doe",
		fathersName: "Richard Doe",
		semester: "5",
		branch: "Electrical Engineering",
	},
	{
		registrationNumber: "220099510649",
		name: "John Doe",
		fathersName: "Richard Doe",
		semester: "5",
		branch: "Electrical Engineering",
	},
	{
		registrationNumber: "220099510649",
		name: "John Doe",
		fathersName: "Richard Doe",
		semester: "5",
		branch: "Electrical Engineering",
	},
	{
		registrationNumber: "220099510649",
		name: "John Doe",
		fathersName: "Richard Doe",
		semester: "5",
		branch: "Electrical Engineering",
	},
	{
		registrationNumber: "220099510649",
		name: "John Doe",
		fathersName: "Richard Doe",
		semester: "5",
		branch: "Electrical Engineering",
	},
	{
		registrationNumber: "220099510649",
		name: "John Doe",
		fathersName: "Richard Doe",
		semester: "5",
		branch: "Electrical Engineering",
	},
	{
		registrationNumber: "220099510649",
		name: "John Doe",
		fathersName: "Richard Doe",
		semester: "5",
		branch: "Electrical Engineering",
	},
	{
		registrationNumber: "220099510649",
		name: "John Doe",
		fathersName: "Richard Doe",
		semester: "5",
		branch: "Electrical Engineering",
	},
	{
		registrationNumber: "220099510649",
		name: "John Doe",
		fathersName: "Richard Doe",
		semester: "5",
		branch: "Electrical Engineering",
	},
	{
		registrationNumber: "220099510649",
		name: "John Doe",
		fathersName: "Richard Doe",
		semester: "5",
		branch: "Electrical Engineering",
	},
	{
		registrationNumber: "220099510649",
		name: "John Doe",
		fathersName: "Richard Doe",
		semester: "5",
		branch: "Electrical Engineering",
	},
	{
		registrationNumber: "220099510649",
		name: "John Doe",
		fathersName: "Richard Doe",
		semester: "5",
		branch: "Electrical Engineering",
	},
	{
		registrationNumber: "220099510649",
		name: "John Doe",
		fathersName: "Richard Doe",
		semester: "5",
		branch: "Electrical Engineering",
	},
	{
		registrationNumber: "220099510649",
		name: "John Doe",
		fathersName: "Richard Doe",
		semester: "5",
		branch: "Electrical Engineering",
	},
	{
		registrationNumber: "220099510649",
		name: "John Doe",
		fathersName: "Richard Doe",
		semester: "5",
		branch: "Electrical Engineering",
	},
	{
		registrationNumber: "220099510649",
		name: "John Doe",
		fathersName: "Richard Doe",
		semester: "5",
		branch: "Electrical Engineering",
	},
	{
		registrationNumber: "220099510649",
		name: "John Doe",
		fathersName: "Richard Doe",
		semester: "5",
		branch: "Electrical Engineering",
	},
	{
		registrationNumber: "220099510649",
		name: "kirti",
		fathersName: "Richard Doe",
		semester: "5",
		branch: "Electrical Engineering",
	},
];

export default function StudentView() {
	const [search, setSearch] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const rowsPerPage = 17;

	const filteredData = data.filter((row) =>
		`${row.registrationNumber} ${row.name} ${row.fathersName} ${row.semester} ${row.branch}`
			.toLowerCase()
			.includes(search.toLowerCase()),
	);

	const totalPages: number = Math.ceil(filteredData.length / rowsPerPage);
	const currentRows = filteredData.slice(
		(currentPage - 1) * rowsPerPage,
		currentPage * rowsPerPage,
	);

	const handlePageChange = (page: number): void => setCurrentPage(page);

	return (
		<div className="w-full px-4">
			<div className="flex justify-end">
				<Link href={"/admin/student/create"}>
					<Button className="w-auto right-0">Register Student</Button>
				</Link>
			</div>

			<input
				type="text"
				value={search}
				onChange={(e) => {
					setSearch(e.target.value);
					setCurrentPage(1);
				}}
				placeholder="Search by Name, Registration Number, Branch, etc..."
				className="w-full mb-4 p-2 border border-gray-300 rounded-md"
			/>

			<Table className="w-full">
				<TableHeader>
					<TableRow>
						<TableHead className="w-[20%]">Registration Number</TableHead>
						<TableHead className="w-[20%]">Name</TableHead>
						<TableHead className="w-[20%]">Father Name</TableHead>
						<TableHead className="w-[20%]">Semester</TableHead>
						<TableHead className="w-[20%]">Branch</TableHead>
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
								<TableCell>{row.fathersName}</TableCell>
								<TableCell>{row.semester}</TableCell>
								<TableCell>{row.branch}</TableCell>
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={5} className="text-center py-4">
								No matching records found.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>

			{totalPages > 1 && (
				<div className="mt-10">
					<Pagination>
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious
									href="#"
									onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
								/>
							</PaginationItem>

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
			)}
		</div>
	);
}
