"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { useRef } from "react";
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
	const { id } = useParams();
	const { register, control, setValue, handleSubmit, watch, reset } = useForm<FormValues>({
		defaultValues: { semesters: [] },
	});

	const [allSemesters, setAllSemesters] = useState<Semester[]>([]);
	const [subjects, setSubjects] = useState<Subject[]>([]);

	const { fields, append } = useFieldArray({
		control,
		name: "semesters",
	});

	const hasAppended = useRef(false);

	useEffect(() => {
		if (!id || hasAppended.current) return;

		const fetchBatchAndSubjects = async () => {
			try {
				const res = await apiService.get(`/batch/${id}`);
				console.log("Batch response:", res.data);

				const batchSemesters = res.data.payload.semesters;
				setAllSemesters(batchSemesters);

				appendSemesters(batchSemesters);
				hasAppended.current = true;
			} catch (error) {
				console.error("Error fetching batch data:", error);
			}

			try {
				const subRes = await apiService.get("/subjects");
				console.log("Subjects fetched:", subRes.data.payload);
				setSubjects(subRes.data.payload);
			} catch (error) {
				console.error("Error fetching subjects:", error);
			}
		};

		const appendSemesters = (semesters: Semester[]) => {
			reset({ semesters: [] });
			semesters.forEach((sem) => {
				append({
					semesterId: sem.id,
					startDate: sem.start_date ? new Date(sem.start_date) : undefined,
					endDate: sem.end_date ? new Date(sem.end_date) : undefined,
					subjects: [],
				});
			});
		};

		fetchBatchAndSubjects();
	}, [id, append, reset]);
	const onSave = async (data: FormValues) => {
		try {
			const payload = {
				semesters: data.semesters.map((sem) => ({
					id: sem.semesterId,
					start_date: sem.startDate?.toISOString().split("T")[0] || null,
					end_date: sem.endDate?.toISOString().split("T")[0] || null,
					subject_ids: sem.subjects.filter((s) => s !== undefined) as number[],
				})),
			};

			const response = await apiService.post(`/batch/${id}/details`, payload);
			console.log("Saved successfully:", response.data);

			alert("Data saved successfully!");
		} catch (error) {
			console.error("Error saving semester data:", error);
			alert("Failed to save data.");
		}
	};

	const onSubmit = (data: FormValues) => {
		console.log("Submitted Data:", data);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
			{fields.map((field, index) => {
				const selectedSubjects = watch(`semesters.${index}.subjects`) || [];

				return (
					<div key={field.id} className=" border p-4 rounded-md space-y-4">
						<h3 className="text-lg font-bold">
							Semester{" "}
							{allSemesters.find((s) => s.id === field.semesterId)?.title ||
								index + 1}
						</h3>

						{/* Dates */}
						<div className="flex">
							{/* Start Date */}
							<div className="flex flex-col mr-5">
								<Label className=" mb-2">Start Date</Label>
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
							<div className="flex flex-col ">
								<Label className="mb-2">End Date</Label>
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
						<div className="flex flex-col">
							<Label className="mb-2">Subjects</Label>
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
									<SelectTrigger className={cn("w-[200px] text-left mb-2")}>
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
								className={cn("w-[200px] text-left")}
								type="button"
								variant="outline"
								onClick={() => {
									setValue(`semesters.${index}.subjects`, [
										...selectedSubjects,
										undefined,
									]);
								}}
							>
								+ Add Subject
							</Button>
						</div>
					</div>
				);
			})}
			<div className="flex gap-4 mb-6 ">
				<Button className="px-6 mb-6" type="submit" onClick={handleSubmit(onSave)}>
					Save
				</Button>
			</div>
		</form>
	);
}
