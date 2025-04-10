"use client";
import * as React from "react";
import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import apiService from "@/services/api-service"; // Import your apiService
import handleFormValidationErrors from "@/lib/handle-form-validation-errors"; // Ensure this utility exists
import { toast } from "sonner"; // Import toast for displaying error messages
import { useRouter } from "next/navigation"; // Import useRouter for redirecting
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
interface FormInput {
	branch_id: number;
	type: string;
}

export default function BatchRegister() {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		setError,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<FormInput>();
	const [branches, setBranches] = React.useState<{ id: number; title: string }[]>([]);
	const [startDate, setStartDate] = React.useState<Date | undefined>();
	const [endDate, setEndDate] = React.useState<Date | undefined>();
	const [startDateError, setStartDateError] = React.useState<string | null>(null);
	const [endDateError, setEndDateError] = React.useState<string | null>(null);

	useEffect(() => {
		const fetchBranches = async () => {
			try {
				const response = await apiService.get("/branches");

				if (response) {
					setBranches(response.data.payload);
				} else {
					console.error("Error fetching branches:");
				}
			} catch (error) {
				console.error("Network error:", error);
			}
		};

		fetchBranches();
	}, []);
	const onSubmit: SubmitHandler<FormInput> = async (data) => {
		try {
			// Send request with token using apiService
			await apiService.post("/batch", data);

			toast.success("batch Created!");
			1;
			router.push("/admin/semester/batch");
		} catch (error: any) {
			// Handle form validation errors
			if (error.response.data.errors) {
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
				<div className="flex flex-col space-y-1.5 ">
					<Label htmlFor="branch_id">Course Type </Label>
					<Input
						id="type"
						placeholder="Enter course type"
						{...register("type", { required: "course type id is required" })}
					/>
					{errors.branch_id && (
						<p className="text-red-500 text-sm">{errors.branch_id.message}</p>
					)}
				</div>

				<div>
					<Label required htmlFor="branch">
						Branch
					</Label>
					<Select
						onValueChange={(value) => {
							setValue("branch_id", Number(value));
						}}
					>
						<SelectTrigger error={errors?.branch_id?.message}>
							<SelectValue
								placeholder={"Select Branch"}
								{...register("branch_id", {
									required: "Branch is required",
								})}
							/>
						</SelectTrigger>

						<SelectContent>
							{branches.map((branch) => (
								<SelectItem key={branch.title} value={branch.id.toString()}>
									{branch.title}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="flex justify-center mt-4">
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? "Submitting..." : "Create Branch"}
					</Button>
				</div>
			</div>
		</form>
	);
}
