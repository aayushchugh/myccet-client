"use client";
// components/student/StudentMarks.tsx
import { useState, useEffect } from "react";
import apiService from "@/services/api-service";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui/input";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

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

export default function StudentMarks() {
	const params = useParams();
	const router = useRouter();

	// Convert to appropriate types and provide fallbacks
	const studentId = params?.id || "";
	const semesterId = params?.semester_id || "";

	const [marksData, setMarksData] = useState<MarksData | null>(null);
	const [marksLoading, setMarksLoading] = useState(false);
	const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [internalMarks, setInternalMarks] = useState<number | null>(null);
	const [externalMarks, setExternalMarks] = useState<number | null>(null);

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

	const handleEdit = (subject: Subject) => {
		setEditingSubject(subject);
		setInternalMarks(subject.internal_marks);
		setExternalMarks(subject.external_marks);
		setIsDialogOpen(true);
	};

	const handleSave = async () => {
		if (!editingSubject) return;

		try {
			// Calculate total marks based on internal and external marks
			const totalMarks = (internalMarks || 0) + (externalMarks || 0);

			// Determine pass/fail status
			const internalPassed =
				internalMarks !== null && internalMarks >= editingSubject.internal_passing_marks;
			const externalPassed =
				externalMarks !== null && externalMarks >= editingSubject.external_passing_marks;
			const isPassed = internalPassed && externalPassed;

			const payload = {
				semester_id: Number(semesterId),
				marks: [
					{
						subject_id: editingSubject.id,
						internal_marks: internalMarks,
						external_marks: externalMarks,
					},
				],
			};

			await apiService.post(`/students/${studentId}/marks`, payload);

			toast.success("Marks updated successfully");
			setIsDialogOpen(false);
			fetchMarks(); // Refresh marks data
		} catch (error) {
			console.error("Error updating marks:", error);
			toast.error("Failed to update marks.");
		}
	};

	const handleCancel = () => {
		setEditingSubject(null);
		setInternalMarks(null);
		setExternalMarks(null);
		setIsDialogOpen(false);
	};

	const handleGoBack = () => {
		router.push(`/admin/student/${studentId}`);
	};

	return (
		<div className="border p-4 rounded-md space-y-4">
			<div className="flex justify-between items-center mb-4">
				{marksData && (
					<div>
						<p className="text-lg font-bold">
							Student: {marksData.student.first_name} {marksData.student.last_name}
						</p>
						<p>Semester: {marksData.semester.title}</p>
					</div>
				)}
				<Button onClick={handleGoBack}>Go Back</Button>
			</div>

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
							<TableHead>Action</TableHead>
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
								<TableCell>
									<Button variant="outline" onClick={() => handleEdit(subject)}>
										Edit
									</Button>
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

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Edit Marks</DialogTitle>
						<DialogDescription>
							Update marks for {editingSubject?.title}
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<label htmlFor="internal-marks" className="text-sm font-medium">
								Internal Marks (Max: {editingSubject?.total_internal_marks},
								Passing: {editingSubject?.internal_passing_marks})
							</label>
							<Input
								id="internal-marks"
								type="number"
								min="0"
								max={editingSubject?.total_internal_marks}
								value={internalMarks === null ? "" : internalMarks}
								onChange={(e) =>
									setInternalMarks(e.target.value ? Number(e.target.value) : null)
								}
							/>
						</div>

						<div className="space-y-2">
							<label htmlFor="external-marks" className="text-sm font-medium">
								External Marks (Max: {editingSubject?.total_external_marks},
								Passing: {editingSubject?.external_passing_marks})
							</label>
							<Input
								id="external-marks"
								type="number"
								min="0"
								max={editingSubject?.total_external_marks}
								value={externalMarks === null ? "" : externalMarks}
								onChange={(e) =>
									setExternalMarks(e.target.value ? Number(e.target.value) : null)
								}
							/>
						</div>
					</div>

					<div className="flex justify-end gap-4">
						<Button variant="outline" onClick={handleCancel}>
							Cancel
						</Button>
						<Button onClick={handleSave}>Save Changes</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
