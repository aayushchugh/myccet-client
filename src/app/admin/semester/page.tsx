"use client";
import { useState, useEffect } from "react";
import { Trash2, Pencil, Copy, Check } from "lucide-react";
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
	id: number;
	title: string;
}

export default function TableView() {
	const [data, setData] = useState<TableRowData[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [editingRow, setEditingRow] = useState<number | null>(null);
	const [editTitle, setEditTitle] = useState("");
	const rowsPerPage = 17;

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await apiService.get("/semesters");
				const responseData = response.data.payload;
				if (!Array.isArray(responseData)) {
					throw new Error("Invalid data format");
				}
				setData(responseData);
			} catch (error) {
				setError("An error occurred while fetching data");
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

	const handleDelete = async (id: number) => {
		try {
			await apiService.delete(`/semesters/${id}`);
			setData((prevData) => prevData.filter((item) => item.id !== id));
			toast.success("Semester deleted successfully");
		} catch (error) {
			console.error("Error deleting semester:", error);
			toast.error("Failed to delete the semester");
		}
	};

	const handleEdit = (row: TableRowData) => {
		setEditingRow(row.id);
		setEditTitle(row.title);
	};

	const handleUpdate = async (id: number) => {
		try {
			await apiService.put(`/semesters/${id}`, { title: editTitle });
			setData((prevData) =>
				prevData.map((item) => (item.id === id ? { ...item, title: editTitle } : item)),
			);
			toast.success("Semester updated successfully");
			setEditingRow(null);
		} catch (error) {
			console.error("Error updating semester:", error);
			toast.error("Failed to update the semester");
		}
	};

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div className="text-red-500">{error}</div>;

	return (
		<div className="w-full px-4">
			<Table className="w-full">
				<TableHeader>
					<TableRow>
						<TableHead className="w-[70%]">Semester</TableHead>
						<TableHead className="w-[5%] text-center"></TableHead>
						<TableHead className="w-[5%] text-center"></TableHead>
						<TableHead className="w-[5%] text-center"></TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{currentRows.map((row) => (
						<TableRow key={row.id}>
							<TableCell>
								{editingRow === row.id ? (
									<input
										type="text"
										value={editTitle}
										onChange={(e) => setEditTitle(e.target.value)}
									/>
								) : (
									row.title
								)}
							</TableCell>
							<TableCell>
								<Copy size={16} />
							</TableCell>
							<TableCell>
								{editingRow === row.id ? (
									<Check size={16} onClick={() => handleUpdate(row.id)} />
								) : (
									<Pencil size={16} onClick={() => handleEdit(row)} />
								)}
							</TableCell>
							<TableCell>
								<Trash2
									color="red"
									size={16}
									onClick={() => handleDelete(row.id)}
								/>
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
