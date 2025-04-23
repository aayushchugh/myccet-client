"use client";
import { useState, useEffect } from "react";
import { Trash2, Pencil, Copy, Check, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui";
import Link from "next/link";
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
	id: any;
	start_year: string;
	end_year: string;
	branch: string;
}

export default function TableView() {
	const [data, setData] = useState<TableRowData[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);

	const rowsPerPage = 17;

	const formatDate = (DateString: string) => {
		const date = new Date(DateString);
		if (isNaN(date.getTime())) return DateString;
		const year = date.getFullYear();
		return `${year}`;
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await apiService.get("batch", {});
				const responseData = response.data.payload;
				if (!Array.isArray(responseData)) throw new Error("Invalid data format");
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

	const handleDelete = async (id: number) => {
		try {
			await apiService.delete(`/batch/${id}`);

			setData((prevData) => prevData.filter((item) => item.id !== id));
			toast.success("Task deleted successfully");
		} catch (error) {
			console.error("Error deleting task:", error);
			toast.error("Failed to delete the task");
		}
	};

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div className="text-red-500">{error}</div>;

	return (
		<div className="w-full px-4">
			<div className="flex justify-end mb-4">
				<Link href={"/admin/batch/create"}>
					<Button className="w-auto">Create Batch</Button>
				</Link>
			</div>
			<Table className="w-full">
				<TableHeader>
					<TableRow>
						<TableHead className="w-[40%]">Batch</TableHead>
						<TableHead className="w-[20%] text-center">Branch</TableHead>
						<TableHead className="w-[5%] text-center"></TableHead>
						<TableHead className="w-[5%] text-center"></TableHead>
						<TableHead className="w-[5%] text-center"></TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{currentRows.map((row) => (
						<TableRow key={row.id}>
							<TableCell className="font-medium">
								<Link href={`/admin/batch/${row.id}`}>
									{formatDate(row.start_year)} - {formatDate(row.end_year)}
								</Link>
							</TableCell>
							<TableCell className="text-center">
								{" "}
								<Link href={`/admin/batch/${row.id}`}>{row.branch}</Link>
							</TableCell>
							<TableCell>
								<Copy size={16} className="cursor-pointer" />
							</TableCell>

							<TableCell>
								<Trash2
									size={16}
									className="cursor-pointer text-red-600"
									onClick={() => handleDelete(row.id)}
								/>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
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
