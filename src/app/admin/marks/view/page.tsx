"use client";
// components/student/StudentMarks.tsx
import { useState, useEffect } from "react";
import apiService from "@/services/api-service";
import { toast } from "sonner";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

interface Subject {
	id: number;
	title: string;
	code: string;
}

interface Mark {
	id: number;
	internal_marks: number;
	external_marks: number;
	total_marks: number;
	is_pass: boolean;
	subject: Subject;
}

interface StudentMarksProps {
	studentId: string | number;
	semesterId: number;
	currentSemesterTitle: string;
}

export default function StudentMarks({
	studentId,
	semesterId,
	currentSemesterTitle,
}: StudentMarksProps) {
	const [marks, setMarks] = useState<Mark[]>([]);
	const [marksLoading, setMarksLoading] = useState(false);

	useEffect(() => {
		if (studentId && semesterId) {
			fetchMarks();
		}
	}, [studentId, semesterId]);

	const fetchMarks = async () => {
		try {
			setMarksLoading(true);
			const response = await apiService.get(
				`/students/${studentId}/semesters/${semesterId}/marks`,
			);
			setMarks(response.data?.payload?.data?.marks || []);
		} catch (error) {
			console.error("Error fetching marks:", error);
			toast.error("Failed to fetch marks.");
			setMarks([]);
		} finally {
			setMarksLoading(false);
		}
	};

	return (
		<div className="border p-4 rounded-md space-y-4">
			<p className="text-lg font-bold">Semester {currentSemesterTitle}</p>
			{marksLoading ? (
				<div>Loading marks data...</div>
			) : marks.length > 0 ? (
				<Table className="w-full">
					<TableHeader>
						<TableRow>
							<TableHead>Subject</TableHead>
							<TableHead>Code</TableHead>
							<TableHead>Internal Marks</TableHead>
							<TableHead>External Marks</TableHead>
							<TableHead>Total Marks</TableHead>
							<TableHead>Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{marks.map((mark) => (
							<TableRow key={mark.id}>
								<TableCell>{mark.subject.title}</TableCell>
								<TableCell>{mark.subject.code}</TableCell>
								<TableCell>{mark.internal_marks}</TableCell>
								<TableCell>{mark.external_marks}</TableCell>
								<TableCell>{mark.total_marks}</TableCell>
								<TableCell>{mark.is_pass ? "Pass" : "Fail"}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			) : (
				<div className="text-gray-500 text-center py-4">
					No marks data available for this semester
				</div>
			)}
		</div>
	);
}
