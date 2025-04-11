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
	start_year: string;
	end_year: string;
	branch: string;
}

export default function TableView() {
	const [data, setData] = useState<TableRowData[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [editingRow, setEditingRow] = useState<string | null>(null);
	const [editEndDate, setEditEndDate] = useState("");
	const rowsPerPage = 17;
	const formatDate = (DateString: string) => {
		const date = new Date(DateString);
		if (isNaN(date.getTime())) return DateString;
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
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

	const handleDelete = async (startDate: string) => {
		try {
			await apiService.delete(`/batch/${startDate}`);
			setData((prevData) => prevData.filter((item) => item.start_year !== startDate));
			toast.success("Subject deleted successfully");
		} catch (error) {
			console.error("Error deleting subject:", error);
			toast.error("Failed to delete the subject");
		}
	};

	const handleEdit = (row: TableRowData) => {
		setEditingRow(row.start_year);
		setEditEndDate(row.end_year);
	};

	const handleUpdate = async (startDate: string) => {
		try {
			await apiService.put(`/subjects/${startDate}`, { endDate: editEndDate });
			setData((prevData) =>
				prevData.map((item) =>
					item.start_year === startDate ? { ...item, endDate: editEndDate } : item,
				),
			);
			toast.success("Subject updated successfully");
			setEditingRow(null);
		} catch (error) {
			console.error("Error updating subject:", error);
			toast.error("Failed to update the subject");
		}
	};

	const handleCancelEdit = () => {
		setEditingRow(null);
		setEditEndDate("");
	};

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div className="text-red-500">{error}</div>;

	return (
		<div className="w-full px-4">
			<div className="flex justify-end mb-4">
				<Link href={"/admin/batch"}>
					<Button className="w-auto">Create Batch</Button>
				</Link>
			</div>
			<Table className="w-full">
				<TableHeader>
					<TableRow>
						<TableHead className="w-[20%]">Start Date</TableHead>
						<TableHead className="w-[40%]">End Date</TableHead>
						<TableHead className="w-[20%] text-center">Branch</TableHead>
						<TableHead className="w-[5%] text-center"></TableHead>
						<TableHead className="w-[5%] text-center"></TableHead>
						<TableHead className="w-[5%] text-center"></TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{currentRows.map((row) => (
						<TableRow key={row.start_year}>
							<TableCell className="font-medium">
								{formatDate(row.start_year)}
							</TableCell>
							<TableCell>
								{editingRow === row.start_year ? (
									<input
										type="text"
										value={editEndDate}
										onChange={(e) => setEditEndDate(e.target.value)}
										onKeyDown={(e) => {
											if (e.key === "Enter") handleUpdate(row.start_year);
											if (e.key === "Escape") handleCancelEdit();
										}}
										autoFocus
										className="border rounded px-2 py-1 w-full"
									/>
								) : (
									formatDate(row.end_year)
								)}
							</TableCell>
							<TableCell className="text-center">{row.branch}</TableCell>
							<TableCell>
								<Copy size={16} className="cursor-pointer" />
							</TableCell>
							<TableCell>
								{editingRow === row.start_year ? (
									<div className="flex gap-2">
										<Check
											size={16}
											className="cursor-pointer text-green-600"
											onClick={() => handleUpdate(row.start_year)}
										/>
										<X
											size={16}
											className="cursor-pointer text-red-600"
											onClick={handleCancelEdit}
										/>
									</div>
								) : (
									<Pencil
										size={16}
										className="cursor-pointer"
										onClick={() => handleEdit(row)}
									/>
								)}
							</TableCell>
							<TableCell>
								<Trash2
									size={16}
									className="cursor-pointer text-red-600"
									onClick={() => handleDelete(row.start_year)}
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
