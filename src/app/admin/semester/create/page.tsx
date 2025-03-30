"use client";
import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import apiService from "@/services/api-service";
import handleFormValidationErrors from "@/lib/handle-form-validation-errors";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface FormInput {
	title: string;
	branch_id: number;
	subject_ids: string;
}

export default function TeacherRegistrationForm() {
	const router = useRouter();
	const [startDate, setStartDate] = React.useState<Date | undefined>();
	const [endDate, setEndDate] = React.useState<Date | undefined>();
	const [startDateError, setStartDateError] = React.useState<string | null>(null);
	const [endDateError, setEndDateError] = React.useState<string | null>(null);

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<FormInput>();

	const onSubmit: SubmitHandler<FormInput> = async (data) => {
		setStartDateError(null);
		setEndDateError(null);
		console.log("button pressed");
		if (!startDate) {
			setStartDateError("Start date is required.");
		}
		if (!endDate) {
			setEndDateError("End date is required.");
		}
		if (!startDate || !endDate) {
			return;
		}

		try {
			const formattedData = {
				title: data.title,
				branch_id: data.branch_id,
				semster_ids: data.subject_ids,
				start_date: format(startDate, "yyyy-MM-dd"),
				end_date: format(endDate, "yyyy-MM-dd"),
			};

			await apiService.post("/semesters", formattedData);

			toast.success("Semester registered successfully!");
			router.push("/admin/semester");
		} catch (error: any) {
			if (error.response) {
				handleFormValidationErrors(error.response.data.errors, setError);
			}
		}
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="min-h-dvh flex flex-col w-full place-items-center"
		>
			<div className="grid gap-4 w-full max-w-md">
				<div className="flex flex-col space-y-1.5">
					<Label htmlFor="title">Title</Label>
					<Input
						id="title"
						placeholder="Enter title"
						{...register("title", { required: "Title is required" })}
					/>
					{errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
				</div>
				<div className="grid grid-cols-2">
					<div className="flex flex-col space-y-1.5 mr-2">
						<Label htmlFor="subject_ids">Subject IDs</Label>
						<Input
							id="subject_ids"
							placeholder="Enter title"
							{...register("subject_ids", { required: "Subject id  is required" })}
						/>
						{errors.subject_ids && (
							<p className="text-red-500 text-sm">{errors.subject_ids.message}</p>
						)}
					</div>
					<div className="flex flex-col space-y-1.5 ml-2">
						<Label htmlFor="branch_id">Branch Id</Label>
						<Input
							id="branch_id"
							placeholder="Enter Branch id"
							{...register("branch_id", { required: "Branch id is required" })}
						/>
						{errors.branch_id && (
							<p className="text-red-500 text-sm">{errors.branch_id.message}</p>
						)}
					</div>
				</div>
				<div className="flex space-x-5">
					<div className="flex flex-col space-y-1.5">
						<Label htmlFor="startDate">Start Date</Label>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									className={cn(
										"w-[240px] text-left",
										!startDate && "text-muted-foreground",
									)}
								>
									<CalendarIcon />
									{startDate ? format(startDate, "PPP") : "Pick a date"}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0" align="start">
								<Calendar
									mode="single"
									selected={startDate}
									onSelect={setStartDate}
									initialFocus
								/>
							</PopoverContent>
						</Popover>
						{startDateError && <p className="text-red-500 text-sm">{startDateError}</p>}
					</div>
					<div className="flex flex-col space-y-1.5">
						<Label htmlFor="endDate">End Date</Label>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									className={cn(
										"w-[240px] text-left",
										!endDate && "text-muted-foreground",
									)}
								>
									<CalendarIcon />
									{endDate ? format(endDate, "PPP") : "Pick a date"}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0" align="start">
								<Calendar
									mode="single"
									selected={endDate}
									onSelect={setEndDate}
									initialFocus
								/>
							</PopoverContent>
						</Popover>
						{endDateError && <p className="text-red-500 text-sm">{endDateError}</p>}
					</div>
				</div>
				<div className="flex justify-center mt-4">
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? "Submitting..." : "Register"}
					</Button>
				</div>
			</div>
		</form>
	);
}
