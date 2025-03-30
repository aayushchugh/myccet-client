"use client";
import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { Pencil } from "lucide-react";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui";
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

export default function TablwView() {
	const [data, setData] = useState<TableRowData[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, SelectCurrentPage] = useState(1);
	const [editingRow, setEditingRow] = useState<number | null>(null);
	const [editTitle, setEditTitle] = useState("");
	const rowsPerPage = 17;

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await apiService.get("branches", {});
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

	const handleDelete = async (id: number) => {
		try {
			await apiService.delete(`/branches/${id}`);

			setData((prevData) => prevData.filter((item) => item.id !== id));
			toast.success("Task deleted successfully");
		} catch (error) {
			console.error("Error deleting task:", error);
			toast.error("Failed to delete the task");
		}
	};
	const handleEdit = (row: TableRowData) => {
		setEditingRow(row.id);
		setEditTitle(row.title);
	};
	const handleUpdate = async (id: number) => {
		try {
			const updatedData = { title: editTitle };
			await apiService.put(`/branches/${id}`, updatedData);

			setData((prevData) =>
				prevData.map((item) => (item.id === id ? { ...item, title: editTitle } : item)),
			);
			toast.success("Task updated successfully");
			setEditingRow(null);
		} catch (error) {
			console.error("Error updating task:", error);
			toast.error("Failed to update the task");
		}
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}
	if (error) {
		return <div className="text-red-500"> {error}</div>;
	}
	return (
		<div className="w-full px-4">
			<div className="flex justify-end">
				<Link href={"/admin/branch/create"}>
					<Button className="w-auto right-0">Create Branch</Button>
				</Link>
			</div>
			<Table className="w-full ">
				<TableHeader>
					<TableRow>
						<TableHead className="w-[15%] text">Branch ID</TableHead>
						<TableHead className="w-[70%]  te">Branch Name</TableHead>
						<TableHead className="w-[5%] text-center te"></TableHead>
						<TableHead className="w-[5%] text-center te"></TableHead>
						<TableHead className="w-[5%] text-center te"></TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{currentRows.map((row, index) => (
						<TableRow key={index}>
							<TableCell className=" font-medium">{row.id}</TableCell>
							<TableCell>
								{editingRow === row.id ? (
									<input
										value={editTitle}
										onChange={(e) => setEditTitle(e.target.value)}
									/>
								) : (
									row.title
								)}
							</TableCell>

							<TableCell className="">
								<div className="">
									<Copy size={16} />
								</div>
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
									className=""
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
