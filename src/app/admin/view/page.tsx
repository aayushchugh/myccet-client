"use client";
import { useState, useEffect } from "react";
import apiService from "@/services/api-service";
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
	id: number;
	email: string;
	first_name: string;
	middle_name: string;
	last_name: string;
	phone: number;
	designation: string;
	createdBy: string;
}

export default function AdminList() {
	const [data, setData] = useState<TableRowData[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const rowsPerPage = 17;

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await apiService.get("/admin", {});

				const responseData = response.data.payload;
				if (!Array.isArray(responseData)) {
					throw new Error("");
				}

				setData(responseData);
			} catch (error) {
				setError("An error occurred while fetching data.");
				console.error("Error fetching data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);
	const totalPages = Math.ceil(data.length / rowsPerPage);

	const currentRows = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

	const handlePageChange = (page: number): void => {
		setCurrentPage(page);
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div className="text-red-500">{error}</div>;
	}

	return (
		<div className="w-full px-4">
			<Table className="w-full">
				<TableHeader>
					<TableRow>
						<TableHead className="w-[60%]">Email Address</TableHead>
						<TableHead className="w-[25%] ">Name</TableHead>
						<TableHead className="w-[15%] ">Designation</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{currentRows.map((row, index) => (
						<TableRow key={index}>
							<TableCell>{row.email}</TableCell>
							<TableCell className="">
								{`${row.first_name} ${row.middle_name || ""} ${
									row.last_name || ""
								}`.trim()}
							</TableCell>
							<TableCell className="">{row.designation}</TableCell>
							<TableCell className="">{row.createdBy}</TableCell>
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
