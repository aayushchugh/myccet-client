"use client";
import { useState, useEffect } from "react";
import { Trash2, Pencil, Check, X } from "lucide-react";
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
	code: number;
	id: number;
	title: string;
	internal_marks: number;
	external_marks: number;
}

export default function TableView() {
	const [data, setData] = useState<TableRowData[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [editingRow, setEditingRow] = useState<number | null>(null);
	const [editTitle, setEditTitle] = useState("");
	const [code, setCode] = useState("");
	const [editInternalMarks, setEditInternalMarks] = useState<number | null>(null);
	const [editExternalMarks, setEditExternalMarks] = useState<number | null>(null);

	const rowsPerPage = 17;

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await apiService.get("subjects", {});
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

	const handleDelete = async (code: number) => {
		try {
			await apiService.delete(`/subjects/${code}`);
			setData((prevData) => prevData.filter((item) => item.code !== code));
			toast.success("Subject deleted successfully");
		} catch (error) {
			console.error("Error deleting subject:", error);
			toast.error("Failed to delete the subject");
		}
	};

	const handleEdit = (row: TableRowData) => {
		setEditingRow(row.code);
		setEditTitle(row.title);
		setEditInternalMarks(row.internal_marks);
		setEditExternalMarks(row.external_marks);
		setCode(row.code.toString());
	};

	const handleUpdate = async (id: number) => {
		try {
			const updatedData = {
				title: editTitle,
				code: code,
				internal_marks: editInternalMarks,
				external_marks: editExternalMarks,
			};
			await apiService.put(`/subjects/${id}`, updatedData);
			setData((prevData) =>
				prevData.map((item) =>
					item.id === id
						? {
								...item,

								title: editTitle,
								internal_marks: editInternalMarks ?? item.internal_marks,
								external_marks: editExternalMarks ?? item.external_marks,
						  }
						: item,
				),
			);
			toast.success("Subject updated successfully");
			setEditingRow(null);
			setEditInternalMarks(null);
			setEditExternalMarks(null);
		} catch (error) {
			console.error("Error updating subject:", error);
			toast.error("Failed to update the subject");
		}
	};

	const handleCancelEdit = () => {
		setEditingRow(null);
		setEditTitle("");
		setEditInternalMarks(null);
		setEditExternalMarks(null);
	};

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div className="text-red-500">{error}</div>;

	return (
		<div className="w-full px-4">
			<div className="flex justify-end">
				<Link href={"/admin/subject/create"}>
					<Button className="w-auto">Create Subject</Button>
				</Link>
			</div>
			<Table className="w-full">
				<TableHeader>
					<TableRow>
						<TableHead className="w-[15%]">Subject Code</TableHead>
						<TableHead className="w-[30%]">Subject Name</TableHead>
						<TableHead className="w-[20%]">Internal Marks</TableHead>
						<TableHead className="w-[20%]">External Marks</TableHead>
						<TableHead className="w-[5%] text-center"></TableHead>
						<TableHead className="w-[5%] text-center"></TableHead>
						<TableHead className="w-[5%] text-center"></TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{currentRows.map((row) => (
						<TableRow key={row.code}>
							<TableCell className="font-medium">{row.code}</TableCell>
							<TableCell>
								{editingRow === row.code ? (
									<input
										value={editTitle}
										onChange={(e) => setEditTitle(e.target.value)}
										onKeyDown={(e) => {
											if (e.key === "Enter") handleUpdate(row.code);
											if (e.key === "Escape") handleCancelEdit();
										}}
										autoFocus
										className="border rounded px-2 py-1 w-full"
									/>
								) : (
									row.title
								)}
							</TableCell>
							<TableCell>
								{editingRow === row.code ? (
									<input
										type="number"
										value={editInternalMarks ?? ""}
										onChange={(e) =>
											setEditInternalMarks(parseInt(e.target.value) || 0)
										}
										onKeyDown={(e) => {
											if (e.key === "Enter") handleUpdate(row.code);
											if (e.key === "Escape") handleCancelEdit();
										}}
										autoFocus
										className="border rounded px-2 py-1 w-full"
									/>
								) : (
									row.internal_marks
								)}
							</TableCell>
							<TableCell>
								{editingRow === row.code ? (
									<input
										type="number"
										value={editExternalMarks ?? ""}
										onChange={(e) =>
											setEditExternalMarks(parseInt(e.target.value) || 0)
										}
										onKeyDown={(e) => {
											if (e.key === "Enter") handleUpdate(row.id);
											if (e.key === "Escape") handleCancelEdit();
										}}
										autoFocus
										className="border rounded px-2 py-1 w-full"
									/>
								) : (
									row.external_marks
								)}
							</TableCell>

							<TableCell>
								{editingRow === row.code ? (
									<div className="flex gap-2">
										<Check
											size={16}
											className="cursor-pointer text-green-600"
											onClick={() => handleUpdate(row.id)}
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
									onClick={() => handleDelete(row.code)}
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
