"use client";
import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { Pencil } from "lucide-react";
import { Copy } from "lucide-react";
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
interface TableRowData {
	code: number;
	title: string;
}

export default function TablwView() {
	const [data, setData] = useState<TableRowData[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, SelectCurrentPage] = useState(1);
	const rowsPerPage = 17;

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await apiService.get("subjects", {});
				const responseData = response.data.payload;
				if (!Array.isArray(responseData)) {
					throw new Error("");
				}
				setData(responseData);
			} catch (error) {
				setError("an error occured while fethcing data");
				console.error("error Fetching data:", error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, []);

	const totalPages = Math.ceil(data.length / rowsPerPage);

	const currentRows = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
	const handlePageChange = (page: number): void => {
		SelectCurrentPage(page);
	};
	if (isLoading) {
		return <div>Loading...</div>;
	}
	if (error) {
		return <div className="text-red-500"> {error}</div>;
	}

	return (
		<div className="w-full px-4">
			<Table className="w-full ">
				<TableHeader>
					<TableRow>
						<TableHead className="w-[15%] text">Subject Code</TableHead>
						<TableHead className="w-[70%]  te">Subject Name</TableHead>
						<TableHead className="w-[5%] text-center te"></TableHead>
						<TableHead className="w-[5%] text-center te"></TableHead>
						<TableHead className="w-[5%] text-center te"></TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{currentRows.map((row, index) => (
						<TableRow key={index}>
							<TableCell className=" font-medium">{row.code}</TableCell>
							<TableCell className="">{row.title}</TableCell>

							<TableCell className="text-right">
								<Copy size={16} />
							</TableCell>
							<TableCell className="text-right">
								<Pencil size={16} />
							</TableCell>
							<TableCell className="text-right">
								<Trash2 color="red" size={16} />
							</TableCell>
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
