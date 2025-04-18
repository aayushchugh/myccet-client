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
	id: number;
	registration_number: number;
	email: string;
	first_name: string;
	middle_name?: string;
	last_name?: string;
	phone: number;
	father_name: string;
	semester: any;
	branch: any;
	batch: any;
}

export default function AdminList() {
	const [data, setData] = useState<TableRowData[]>([]);

	const [currentPage, setCurrentPage] = useState(1);
	const [search, setSearch] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const rowsPerPage = 17;

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await apiService.get("/students/");
				const facultyData = response.data.payload;
				console.log(facultyData);

				if (!Array.isArray(facultyData)) {
					throw new Error("Invalid data format received.");
				}

				setData(facultyData);
			} catch (err) {
				setError("An error occurred while fetching data.");
				console.error("Error fetching data:", err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	const filteredData = data.filter((row) =>
		`${row.first_name} ${row.middle_name || ""} ${row.last_name || ""} ${row.email} ${
			row.father_name
		} ${row.branch} ${row.registration_number} ${row.semester}`
			.toLowerCase()
			.includes(search.toLowerCase()),
	);

	const totalPages = Math.ceil(filteredData.length / rowsPerPage);
	const currentRows = filteredData.slice(
		(currentPage - 1) * rowsPerPage,
		currentPage * rowsPerPage,
	);

	const handlePageChange = (page: number): void => {
		setCurrentPage(page);
	};

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div className="text-red-500">{error}</div>;

	return (
		<div className="w-full px-4">
			<div className="flex justify-end mb-4">
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
				placeholder="Search..."
				className="w-full mb-4 p-2 border border-gray-300 rounded-md"
			/>

			<Table className="w-full">
				<TableHeader>
					<TableRow>
						<TableHead className="w-[10%]">Registration Number</TableHead>
						<TableHead className="w-[15%]">Name</TableHead>
						<TableHead className="w-[15%]">Father Name</TableHead>
						<TableHead className="w-[25%]">Email</TableHead>
						<TableHead className="w-[10%] text-center">Branch</TableHead>
						<TableHead className="w-[5%] text-center">Semester</TableHead>
						<TableHead className="w-[20%] text-center">Phone</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{currentRows.length > 0 ? (
						currentRows.map((row) => (
							<TableRow key={row.id}>
								<TableCell>
									<Link href={`/admin/student/${row.id}`}>
										{row.registration_number}
									</Link>
								</TableCell>
								<TableCell>
									<Link href={`/admin/student/${row.id}`}>
										{`${row.first_name} ${row.middle_name || ""} ${
											row.last_name || ""
										}`.trim()}
									</Link>
								</TableCell>
								<TableCell>
									<Link href={`/admin/student/${row.id}`}>{row.father_name}</Link>
								</TableCell>

								<TableCell>
									<Link href={`/admin/student/${row.id}`}>{row.email}</Link>
								</TableCell>
								<TableCell className="text-center">
									<Link href={`/admin/student/${row.id}`}>
										{row.branch.title}
									</Link>
								</TableCell>
								<TableCell className="text-center">
									<Link href={`/admin/student/${row.id}`}>
										{row.semester.title}
									</Link>
								</TableCell>
								<TableCell className="text-center">
									<Link href={`/admin/student/${row.id}`}>{row.phone}</Link>
								</TableCell>
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={4} className="text-center py-4">
								No matching records found.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>

			{/* Pagination */}
			{totalPages > 1 && (
				<Pagination className="mt-4">
					<PaginationContent>
						{/* Previous Button */}
						<PaginationItem>
							<PaginationPrevious
								href="#"
								onClick={() => handlePageChange(currentPage - 1)}
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
								onClick={() => handlePageChange(currentPage + 1)}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			)}
		</div>
	);
}
