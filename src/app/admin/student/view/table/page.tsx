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
						<TableHead className="w-[20%]">Registration Number</TableHead>
						<TableHead className="w-[20%]">Name</TableHead>
						<TableHead className="w-[20%]">Fathers name</TableHead>
						<TableHead className="w-[20%]">Semester</TableHead>
						<TableHead className="w-[20%] ">Branch</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{currentRows.map((row, index) => (
						<TableRow key={index}>
							<TableCell className="font-medium">{row.registrationNumber}</TableCell>
							<TableCell>{row.name}</TableCell>
							<TableCell>{row.fathersName}</TableCell>
							<TableCell>{row.semester}</TableCell>
							<TableCell>{row.branch}</TableCell>
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
