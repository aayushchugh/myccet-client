"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { Trash2, Pencil, Copy } from "lucide-react";

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
import apiService from "@/services/api-service";
import { format } from "date-fns";

interface SemesterData {
	title: string;
	start_date: string;
	end_date: string;
}

export default function TableView() {
	const [data, setData] = useState<SemesterData[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const rowsPerPage = 10;

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await apiService.get("/semesters");
				const responseData = response.data.payload;
				if (!Array.isArray(responseData)) {
					throw new Error("Invalid data format received");
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

	const handlePageChange = (page: number) => setCurrentPage(page);

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div className="text-red-500">{error}</div>;

	return (
		<div className="w-full px-4">
			<Table className="w-full">
				<TableHeader>
					<TableRow>
						<TableHead className="w-[15%]">Title</TableHead>
						<TableHead className="w-[35%]">Start Date</TableHead>
						<TableHead className="w-[35%]">End Date</TableHead>
						<TableHead className="w-[5%] text-center"></TableHead>
						<TableHead className="w-[5%] text-center"></TableHead>
						<TableHead className="w-[5%] text-center"></TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{currentRows.map((semester, index) => (
						<TableRow key={index}>
							<TableCell className="font-medium">{semester.title}</TableCell>
							<TableCell>{format(new Date(semester.start_date), "PPP")}</TableCell>
							<TableCell>{format(new Date(semester.end_date), "PPP")}</TableCell>
							<TableCell className="text-center">
								<Copy size={16} className="cursor-pointer" />
							</TableCell>
							<TableCell className="text-center">
								<Pencil size={16} className="cursor-pointer" />
							</TableCell>
							<TableCell className="text-center">
								<Trash2 size={16} className="cursor-pointer text-red-500" />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			{/* Pagination */}
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
		</div>
	);
}
