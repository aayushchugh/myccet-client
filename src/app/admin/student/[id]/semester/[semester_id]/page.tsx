"use client";
// components/student/StudentMarks.tsx
import { useState, useEffect } from "react";
import apiService from "@/services/api-service";
import { toast } from "sonner";
import { useParams } from "next/navigation";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { subMinutes } from "date-fns";

interface Student {
	id: number;
	first_name: string;
	last_name: string;
}

interface Semester {
	id: number;
	title: string;
	batch_id: number;
	start_date: string;
	end_date: string;
}

interface Subject {
	id: number;
	title: string;
	code: string;
	internal_marks: number | null;
	external_marks: number | null;
	internal_passing_marks: number;
	external_passing_marks: number;
	total_internal_marks: number;
	total_external_marks: number;
	total_marks: number | null;
	is_pass: boolean | null;
}

interface MarksData {
	student: Student;
	semester: Semester;
	subjects: Subject[];
}

interface StudentMarksProps {
	studentId: string | number;
	semesterId: number;
	currentSemesterTitle: string;
}

export default function StudentMarks() {
	const params = useParams();

	// Convert to appropriate types and provide fallbacks
	const studentId = params?.id || "";
	const semesterId = params?.semester_id || "";

	const [marksData, setMarksData] = useState<MarksData | null>(null);
	const [marksLoading, setMarksLoading] = useState(false);

	useEffect(() => {
		if (studentId && semesterId) {
			fetchMarks();
		} else {
			console.error("Missing required props: studentId or semesterId is undefined");
		}
	}, [studentId, semesterId]);

	const fetchMarks = async () => {
		try {
			setMarksLoading(true);
			const response = await apiService.get(
				`/students/${studentId}/semesters/${semesterId}/marks`,
			);
			console.log("API Response:", response);

			if (response.data?.payload?.data) {
				setMarksData(response.data.payload.data);
			} else {
				toast.error("Invalid data structure received from API");
				setMarksData(null);
			}
		} catch (error) {
			console.error("Error fetching marks:", error);
			toast.error("Failed to fetch marks.");
			setMarksData(null);
		} finally {
			setMarksLoading(false);
		}
	};

	return (
		<div className="border p-4 rounded-md space-y-4">
			{marksData && (
				<div className="mb-4">
					<p className="text-lg font-bold">
						Student: {marksData.student.first_name} {marksData.student.last_name}
					</p>
					<p>Semester: {marksData.semester.title}</p>
				</div>
			)}

			{/* <p className="text-lg font-bold">Semester {currentSemesterTitle}</p> */}

			{marksLoading ? (
				<div>Loading marks data...</div>
			) : marksData?.subjects && marksData.subjects.length > 0 ? (
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
						{marksData.subjects.map((subject) => (
							<TableRow key={subject.id}>
								<TableCell>{subject.title}</TableCell>
								<TableCell>{subject.code}</TableCell>
								<TableCell>{subject.internal_marks ?? "N/A"}</TableCell>
								<TableCell>{subject.external_marks ?? "N/A"}</TableCell>
								<TableCell>{subject.total_marks ?? "N/A"}</TableCell>
								<TableCell>
									{subject.is_pass === null
										? "Pending"
										: subject.is_pass
										? "Pass"
										: "Fail"}
								</TableCell>
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
