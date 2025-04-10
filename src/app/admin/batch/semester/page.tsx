"use client";
import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import apiService from "@/services/api-service";

interface Subject {
	id: number;
	title: string;
}

interface Semester {
	id: number;
	title: string;
}

interface FormValues {
	semesters: {
		semesterId: number;
		startDate?: Date;
		endDate?: Date;
		subjects: number[];
	}[];
}

export default function SemesterForm() {
	const { register, control, setValue, handleSubmit, watch } = useForm<FormValues>({
		defaultValues: { semesters: [] },
	});

	const [allSemesters, setAllSemesters] = useState<Semester[]>([]);
	const [subjects, setSubjects] = useState<Subject[]>([]);
	const [selectedBranch, setSelectedBranch] = useState<number | null>(null);

	const { fields, append } = useFieldArray({
		control,
		name: "semesters",
	});

	useEffect(() => {
		const fetchSemesters = async () => {
			const res = await apiService.get("/semesters");
			setAllSemesters(res.data.payload);

			// Initialize semester fields
			res.data.payload.forEach((sem: Semester) => {
				append({ semesterId: sem.id, subjects: [] });
			});
		};
		fetchSemesters();
	}, [append]);

	const onSubmit = (data: FormValues) => {
		console.log("Submitted Data:", data);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
			{fields.map((field, index) => (
				<div key={field.id} className="border p-4 rounded-md space-y-4">
					<h3 className="text-lg font-bold">
						Semester{" "}
						{allSemesters.find((s) => s.id === field.semesterId)?.title || index + 1}
					</h3>

					<div className="flex gap-4">
						<div className="space-y-1">
							<Label>Start Date</Label>
							<Popover>
								<PopoverTrigger asChild>
									<Button variant="outline" className={cn("w-[200px] text-left")}>
										<CalendarIcon className="mr-2 h-4 w-4" />
										{watch(`semesters.${index}.startDate`)
											? format(watch(`semesters.${index}.startDate`)!, "PPP")
											: "Pick date"}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										mode="single"
										selected={watch(`semesters.${index}.startDate`)}
										onSelect={(date) =>
											setValue(`semesters.${index}.startDate`, date)
										}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
						</div>

						<div className="space-y-1">
							<Label>End Date</Label>
							<Popover>
								<PopoverTrigger asChild>
									<Button variant="outline" className={cn("w-[200px] text-left")}>
										<CalendarIcon className="mr-2 h-4 w-4" />
										{watch(`semesters.${index}.endDate`)
											? format(watch(`semesters.${index}.endDate`)!, "PPP")
											: "Pick date"}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										mode="single"
										selected={watch(`semesters.${index}.endDate`)}
										onSelect={(date) =>
											setValue(`semesters.${index}.endDate`, date)
										}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
						</div>
					</div>

					<div className="space-y-2">
						<Label>Subjects</Label>
						{watch(`semesters.${index}.subjects`)?.map((_, subIndex) => (
							<Select
								key={subIndex}
								onValueChange={(value) => {
									const updatedSubjects = [
										...(watch(`semesters.${index}.subjects`) || []),
									];
									updatedSubjects[subIndex] = Number(value);
									setValue(`semesters.${index}.subjects`, updatedSubjects);
								}}
							>
								<SelectTrigger>
									<SelectValue placeholder={`Select Subject ${subIndex + 1}`} />
								</SelectTrigger>
								<SelectContent>
									{subjects.map((subject) => (
										<SelectItem key={subject.id} value={subject.id.toString()}>
											{subject.title}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						))}
						<Button
							type="button"
							onClick={() => {
								const current = watch(`semesters.${index}.subjects`) || [];
								setValue(`semesters.${index}.subjects`, [...current, 0]);
							}}
						>
							+ Add Subject
						</Button>
					</div>
				</div>
			))}

			<Button type="submit">Next →</Button>
		</form>
	);
}
