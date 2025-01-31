"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

interface TableRowData {
	studentName: string;
	subjectName: string;
	subjectMarksFirst: number;
	subjectMarksSecond: number;
	subjectMarksThird: number;
	subjectMarksPractical: number;
	subjectMarksSemester: number;
	branch: string;
	sem: number;
}

const dataFirstSem: TableRowData[] = [
	{
		studentName: "Student Name",
		subjectName: "Physics",
		subjectMarksFirst: 75,
		subjectMarksSecond: 80,
		subjectMarksThird: 85,
		subjectMarksPractical: 90,
		subjectMarksSemester: 88,
		branch: "CSE",
		sem: 1,
	},
	{
		studentName: "Student Name",
		subjectName: "Chemistry",
		subjectMarksFirst: 70,
		subjectMarksSecond: 78,
		subjectMarksThird: 80,
		subjectMarksPractical: 85,
		subjectMarksSemester: 82,
		branch: "CSE",
		sem: 1,
	},
	{
		studentName: "Student Name",
		subjectName: "Mathematics",
		subjectMarksFirst: 88,
		subjectMarksSecond: 92,
		subjectMarksThird: 95,
		subjectMarksPractical: 0,
		subjectMarksSemester: 90,
		branch: "CSE",
		sem: 1,
	},
	{
		studentName: "Student Name",
		subjectName: "English",
		subjectMarksFirst: 85,
		subjectMarksSecond: 87,
		subjectMarksThird: 89,
		subjectMarksPractical: 0,
		subjectMarksSemester: 86,
		branch: "CSE",
		sem: 1,
	},
	{
		studentName: "Student Name",
		subjectName: "Programming",
		subjectMarksFirst: 90,
		subjectMarksSecond: 92,
		subjectMarksThird: 94,
		subjectMarksPractical: 95,
		subjectMarksSemester: 96,
		branch: "CSE",
		sem: 1,
	},
	{
		studentName: "Student Name",
		subjectName: "Electronics",
		subjectMarksFirst: 78,
		subjectMarksSecond: 80,
		subjectMarksThird: 85,
		subjectMarksPractical: 88,
		subjectMarksSemester: 83,
		branch: "CSE",
		sem: 1,
	},
];

export default function TableDemo() {
	const studentName = dataFirstSem[0].studentName;
	const branch = dataFirstSem[0].branch;
	const sem = dataFirstSem[0].sem;

	// Total marks assumption (each subject has 100 per sessional, practical, and semester)
	const totalSubjects = dataFirstSem.length;
	const totalMarks = {
		subjectMarksFirst: totalSubjects * 100,
		subjectMarksSecond: totalSubjects * 100,
		subjectMarksThird: totalSubjects * 100,
		subjectMarksPractical: totalSubjects * 100,
		subjectMarksSemester: totalSubjects * 100,
	};

	// Calculate obtained marks
	const obtainedMarks = dataFirstSem.reduce(
		(acc, subject) => {
			acc.subjectMarksFirst += subject.subjectMarksFirst;
			acc.subjectMarksSecond += subject.subjectMarksSecond;
			acc.subjectMarksThird += subject.subjectMarksThird;
			acc.subjectMarksPractical += subject.subjectMarksPractical;
			acc.subjectMarksSemester += subject.subjectMarksSemester;
			return acc;
		},
		{
			subjectMarksFirst: 0,
			subjectMarksSecond: 0,
			subjectMarksThird: 0,
			subjectMarksPractical: 0,
			subjectMarksSemester: 0,
		},
	);

	return (
		<div className="w-full px-4">
			<div className="flex w-auto my-10 font-medium text-muted-foreground">
				<div>
					<p>{studentName}</p>
					<div className="flex justify-between">
						<p>{branch}</p>
						<p>{sem}</p>
					</div>
				</div>
			</div>

			<Table className="w-full">
				<TableHeader>
					<TableRow>
						<TableHead className="w-[16.66%] text-center">Subject</TableHead>
						<TableHead className="w-[16.66%] text-center">1st Sessional</TableHead>
						<TableHead className="w-[16.66%] text-center">2nd Sessional</TableHead>
						<TableHead className="w-[16.66%] text-center">3rd Sessional</TableHead>
						<TableHead className="w-[16.66%] text-center">Practical</TableHead>
						<TableHead className="w-[16.66%] text-center">Semester</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{/* Display all subjects */}
					{dataFirstSem.map((row, index) => (
						<TableRow key={index}>
							<TableCell className="text-center font-medium text-muted-foreground">
								{row.subjectName}
							</TableCell>
							<TableCell className="text-center">{row.subjectMarksFirst}</TableCell>
							<TableCell className="text-center">{row.subjectMarksSecond}</TableCell>
							<TableCell className="text-center">{row.subjectMarksThird}</TableCell>
							<TableCell className="text-center">
								{row.subjectMarksPractical}
							</TableCell>
							<TableCell className="text-center">
								{row.subjectMarksSemester}
							</TableCell>
						</TableRow>
					))}

					{/* Obtained Marks Row */}
					<TableRow className="bg-gray-100">
						<TableCell className="text-center font-semibold">Obtained Marks</TableCell>
						<TableCell className="text-center font-semibold">
							{obtainedMarks.subjectMarksFirst}
						</TableCell>
						<TableCell className="text-center font-semibold">
							{obtainedMarks.subjectMarksSecond}
						</TableCell>
						<TableCell className="text-center font-semibold">
							{obtainedMarks.subjectMarksThird}
						</TableCell>
						<TableCell className="text-center font-semibold">
							{obtainedMarks.subjectMarksPractical}
						</TableCell>
						<TableCell className="text-center font-semibold">
							{obtainedMarks.subjectMarksSemester}
						</TableCell>
					</TableRow>
					{/* Total Marks Row */}
					<TableRow className="bg-gray-200">
						<TableCell className="text-center font-semibold">Total Marks</TableCell>
						<TableCell className="text-center font-semibold">
							{totalMarks.subjectMarksFirst}
						</TableCell>
						<TableCell className="text-center font-semibold">
							{totalMarks.subjectMarksSecond}
						</TableCell>
						<TableCell className="text-center font-semibold">
							{totalMarks.subjectMarksThird}
						</TableCell>
						<TableCell className="text-center font-semibold">
							{totalMarks.subjectMarksPractical}
						</TableCell>
						<TableCell className="text-center font-semibold">
							{totalMarks.subjectMarksSemester}
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</div>
	);
}
