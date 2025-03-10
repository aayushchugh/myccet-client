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
}

export default function TeacherRegistrationForm() {
	const router = useRouter();
	const [startDate, setStartDate] = React.useState<Date | undefined>();
	const [endDate, setEndDate] = React.useState<Date | undefined>();

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<FormInput>();

	const onSubmit: SubmitHandler<FormInput> = async (data) => {
		const token = localStorage.getItem("token");
		if (!token) {
			toast.error("You are not authenticated. Please log in first.");
			router.push("/login");
			return;
		}

		if (!startDate || !endDate) {
			toast.error("Please select both start and end dates.");
			return;
		}

		try {
			const formattedData = {
				title: data.title,
				start_date: format(startDate, "yyyy-MM-dd"),
				end_date: format(endDate, "yyyy-MM-dd"),
			};

			const response = await apiService.post("/semesters", formattedData, {
				headers: { Authorization: `Bearer ${token}` },
			});
			console.log("API Response:", response.data);
			toast.success("Teacher registered successfully!");
			router.push("/admin/semester/view");
		} catch (error: any) {
			if (error.response) {
				if (error.response.status === 409) {
					toast.error("A conflict occurred. Please check your input.");
					return;
				}
				if (error.response.status === 401) {
					toast.error("Unauthorized. Please log in again.");
					localStorage.removeItem("token");
					router.push("/login");
					return;
				}
				handleFormValidationErrors(error.response.data.errors, setError);
			} else {
				toast.error("An unexpected error occurred. Please try again.");
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
