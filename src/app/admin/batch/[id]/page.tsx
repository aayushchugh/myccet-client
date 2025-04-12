"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
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
	start_date: string | null;
	end_date: string | null;
}

interface FormValues {
	semesters: {
		semesterId: number;
		startDate?: Date;
		endDate?: Date;
		subjects: (number | undefined)[];
	}[];
}

export default function SemesterForm() {
	const router = useRouter();
	const { id } = useParams();
	const { register, control, setValue, handleSubmit, watch, reset } = useForm<FormValues>({
		defaultValues: { semesters: [] },
	});

	const [allSemesters, setAllSemesters] = useState<Semester[]>([]);
	const [subjects, setSubjects] = useState<Subject[]>([]);
	const [loading, setLoading] = useState(true);

	const { fields, append } = useFieldArray({
		control,
		name: "semesters",
	});

	const hasAppended = useRef(false);

	useEffect(() => {
		if (!id || hasAppended.current) return;

		const fetchAndInitSemesters = async () => {
			try {
				// Step 1: Fetch batch
				const res = await apiService.get(`/batch/${id}`);
				let semesters = res.data?.payload?.semesters || [];

				// Step 2: If semesters not found, initialize
				if (semesters.length === 0) {
					console.log("Semesters not found. Initializing via /detail...");
					await apiService.post(`/batch/${id}/detail`);

					// Step 3: Fetch again after initializing
					const updatedRes = await apiService.get(`/batch/${id}`);
					semesters = updatedRes.data?.payload?.semesters || [];
				}

				// Step 4: Set state and form values
				setAllSemesters(semesters);
				reset({ semesters: [] });

				semesters.forEach((sem: Semester) => {
					append({
						semesterId: sem.id,
						startDate: sem.start_date ? new Date(sem.start_date) : undefined,
						endDate: sem.end_date ? new Date(sem.end_date) : undefined,
						subjects: [],
					});
				});

				hasAppended.current = true;
			} catch (error) {
				console.error("Error fetching or initializing semesters:", error);
			}

			// Always try to fetch subjects
			try {
				const subRes = await apiService.get("/subjects");
				setSubjects(subRes.data.payload);
			} catch (error) {
				console.error("Error fetching subjects:", error);
			}
		};

		fetchAndInitSemesters();
	}, [id, append, reset]);

	const onSubmit = async (data: FormValues) => {
		console.log("Form Data:", data);

		const formattedSemesters = data.semesters.map((sem) => ({
			id: sem.semesterId,
			start_date: sem.startDate?.toISOString().split("T")[0],
			end_date: sem.endDate?.toISOString().split("T")[0],
			subject_ids: sem.subjects.filter(Boolean),
		}));

		try {
			const response = await apiService.post(`/batch/${id}/semester`, {
				semesters: formattedSemesters,
			});
			console.log("Semester data saved:", response.data);
			// Add redirect/success message if needed
		} catch (error) {
			console.error("Failed to save semesters:", error);
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
			{fields.map((field, index) => {
				const selectedSubjects = watch(`semesters.${index}.subjects`) || [];

				return (
					<div key={field.id} className="border p-4 rounded-md space-y-4">
						<h3 className="text-lg font-bold">
							Semester{" "}
							{allSemesters.find((s) => s.id === field.semesterId)?.title ||
								index + 1}
						</h3>

						{/* Dates */}
						<div className="flex gap-4">
							{/* Start Date */}
							<div className="space-y-1">
								<Label>Start Date</Label>
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant="outline"
											className={cn("w-[200px] text-left")}
										>
											<CalendarIcon className="mr-2 h-4 w-4" />
											{watch(`semesters.${index}.startDate`)
												? format(
														watch(`semesters.${index}.startDate`)!,
														"PPP",
												  )
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

							{/* End Date */}
							<div className="space-y-1">
								<Label>End Date</Label>
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant="outline"
											className={cn("w-[200px] text-left")}
										>
											<CalendarIcon className="mr-2 h-4 w-4" />
											{watch(`semesters.${index}.endDate`)
												? format(
														watch(`semesters.${index}.endDate`)!,
														"PPP",
												  )
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

						{/* Subjects */}
						<div className="space-y-2">
							<Label>Subjects</Label>
							{selectedSubjects.map((subject, subIndex) => (
								<Select
									key={`sem-${index}-sub-${subIndex}`}
									onValueChange={(value) => {
										const updated = [...selectedSubjects];
										updated[subIndex] = Number(value);
										setValue(`semesters.${index}.subjects`, updated);
									}}
									value={subject?.toString()}
								>
									<SelectTrigger>
										<SelectValue
											placeholder={`Select Subject ${subIndex + 1}`}
										/>
									</SelectTrigger>
									<SelectContent>
										{subjects.map((subject) => (
											<SelectItem
												key={subject.id}
												value={subject.id.toString()}
											>
												{subject.title}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							))}
							<Button
								type="button"
								variant="outline"
								onClick={() =>
									setValue(`semesters.${index}.subjects`, [
										...selectedSubjects,
										undefined,
									])
								}
							>
								+ Add Subject
							</Button>
						</div>
					</div>
				);
			})}

			{/* <Button type="submit">Next →</Button> */}
			<Button type="submit">save</Button>
		</form>
	);
}
