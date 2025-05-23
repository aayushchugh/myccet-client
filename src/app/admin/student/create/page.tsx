"use client";
import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { toast } from "sonner";
import handleFormValidationErrors from "@/lib/handle-form-validation-errors";
import { useRouter } from "next/navigation";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import apiService from "@/services/api-service";

interface FormInput {
	first_name: string;
	middle_name: string;
	last_name: string;
	email: string;
	phone: number;
	father_name: string;
	mother_name: string;
	current_semester_id: number;
	password: string;
	category: string;

	batch_id: number;
	registration_number: number;
	batch: any;
}

export default function TeacherRegistrationForm() {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		setValue,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<FormInput>();

	const [batch, setBatch] = React.useState<
		{ id: number; branch: string; type: string; start_year: any; end_year: any }[]
	>([]);
	const [semesters, setSemesters] = React.useState<
		{ id: number; title: string; start_date: string; end_date: string }[]
	>([]);
	const formatDate = (DateString: string) => {
		const date = new Date(DateString);
		if (isNaN(date.getTime())) return DateString;
		const year = date.getFullYear();

		return `${year}`;
	};

	useEffect(() => {
		const fetchBatches = async () => {
			try {
				const response = await apiService.get("/batch");

				if (response) {
					setBatch(response.data.payload);
				} else {
					console.error("Error fetching branches:");
				}
			} catch (error) {
				console.error("Network error:", error);
			}
		};

		fetchBatches();
	}, []);

	const onSubmit: SubmitHandler<FormInput> = async (data) => {
		try {
			await apiService.post("/students", data);

			toast.success("Student Created!");
			router.push("/admin/student");
		} catch (error: any) {
			console.error("❌ API Error:", error);

			if (error.response) {
				console.log(" Server Response:", error.response.data);

				// Handle 409 Conflict errors
				if (error.response.status === 409) {
					const errorMessage =
						error.response.data.message ||
						"A conflict occurred. Please check your input.";
					toast.error(errorMessage);

					// Optionally, set form errors for specific fields
					if (error.response.data.errors) {
						handleFormValidationErrors(error.response.data.errors, setError);
					}
					return;
				}

				// Handle 401 Unauthorized errors
				if (error.response.status === 401) {
					toast.error("You are not authorized. Please log in again.");
					localStorage.removeItem("token"); // Clear invalid token
					router.push("/login"); // Redirect to login page
					return;
				}

				// Handle form validation errors
				if (error.response.status === 400 || error.response.status === 404) {
					handleFormValidationErrors(error.response.data.errors, setError);
				}

				// Handle 500 errors
				if (error.response.status === 500) {
					toast.error("Server error. Please try again later.");
				}
			} else {
				// Handle network errors or unexpected errors
				toast.error("An unexpected error occurred. Please try again.");
			}
		}
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="min-h-dvh flex flex-col w-full place-items-center"
		>
			<div>
				<div className="grid gap-4 w-full ">
					<div className="grid grid-cols-3 gap-4">
						<div className="flex flex-col space-y-1.5">
							<Label required htmlFor="first_name">
								First Name
							</Label>
							<Input
								id="first_name"
								placeholder="First Name"
								error={errors.first_name?.message}
								{...register("first_name", {
									required: "First name is required",
								})}
							/>
						</div>
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="middle_name">Middle Name</Label>
							<Input
								id="middle_name"
								placeholder="Middle Name"
								{...register("middle_name")}
							/>
						</div>
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="last_name">Last Name</Label>
							<Input
								id="lastName"
								placeholder="Last Name"
								{...register("last_name")}
							/>
						</div>
					</div>
					<div className="flex flex-col space-y-1.5">
						<Label required htmlFor="registration_number">
							Registration Number
						</Label>
						<Input
							id="registration_number"
							type="number"
							placeholder="Registration Number"
							error={errors.registration_number?.message}
							{...register("registration_number", {
								required: "Registration number is required",
								setValueAs: (v) => Number(v),
							})}
						/>
					</div>
					<div className="flex flex-col space-y-1.5">
						<Label required htmlFor="email">
							Email
						</Label>
						<Input
							id="email"
							type="email"
							placeholder="Enter your email"
							error={errors.email?.message}
							{...register("email", {
								required: "Email is required",
								pattern: {
									value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
									message: "Enter a valid email address",
								},
							})}
						/>
					</div>
					<div className="flex flex-col space-y-1.5">
						<Label required htmlFor="phone">
							Phone Number
						</Label>
						<Input
							id="phone"
							type="tel"
							placeholder="Phone Number"
							error={errors.phone?.message}
							{...register("phone", {
								required: "Phone number is required",
								setValueAs: (v) => Number(v),
							})}
						/>
					</div>
					<div className="flex flex-col space-y-1.5">
						<Label required htmlFor="father_name">
							Father Name
						</Label>
						<Input
							id="father_name"
							placeholder="Father name"
							error={errors.father_name?.message}
							{...register("father_name", {
								required: "Father name is required",
							})}
						/>
					</div>
					<div className="flex flex-col space-y-1.5">
						<Label required htmlFor="mother_name">
							Mother Name
						</Label>
						<Input
							id="mother_name"
							placeholder="Mother name Name"
							error={errors.mother_name?.message}
							{...register("mother_name", {
								required: "Mother name name is required",
							})}
						/>
					</div>
					<div className="flex flex-col space-y-1.5">
						<Label required htmlFor="password">
							Password
						</Label>
						<Input
							id="password"
							type="password"
							placeholder="Password"
							error={errors.password?.message}
							{...register("password", {
								required: "Password is required",
								minLength: {
									value: 6,
									message: "Password must be at least 6 characters long",
								},
							})}
						/>
					</div>

					<div>
						<Label required htmlFor="batch">
							Batch
						</Label>
						<Select
							onValueChange={async (value) => {
								const batchId = Number(value);
								setValue("batch_id", batchId);

								try {
									const response = await apiService.get(`/batch/${batchId}`);
									const fetchedSemesters = response.data.payload.semesters || [];
									setSemesters(fetchedSemesters);
								} catch (error) {
									console.error("Error fetching semesters:", error);
									setSemesters([]);
								}
							}}
						>
							<SelectTrigger error={errors?.batch_id?.message}>
								<SelectValue
									placeholder={"Select Batch"}
									{...register("batch_id", {
										required: "Batch is required",
									})}
								/>
							</SelectTrigger>

							<SelectContent>
								{batch.map((batch) => (
									<SelectItem key={batch.type} value={batch.id.toString()}>
										{formatDate(batch.start_year)}-{formatDate(batch.end_year)}{" "}
										{batch.branch} {batch.type}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="grid grid-cols-2 gap-3">
						<div>
							<Label required htmlFor="designation">
								Semester
							</Label>
							<Select
								onValueChange={(value) => {
									setValue("current_semester_id", Number(value));
								}}
							>
								<SelectTrigger error={errors?.current_semester_id?.message}>
									<SelectValue
										placeholder={"Select semester"}
										{...register("current_semester_id", {
											required: "Semester is required",
										})}
									/>
								</SelectTrigger>

								<SelectContent>
									{semesters.length > 0
										? semesters.map((sem) => (
												<SelectItem key={sem.id} value={sem.id.toString()}>
													Semester {sem.title}
												</SelectItem>
										  ))
										: null}
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label required htmlFor="category">
								Category
							</Label>
							<Select
								onValueChange={(value) => {
									setValue("category", value);
								}}
							>
								<SelectTrigger error={errors?.category?.message}>
									<SelectValue
										placeholder={"Select category"}
										{...register("category", {
											required: "category is required",
										})}
									/>
								</SelectTrigger>

								<SelectContent>
									<SelectItem value="General">General</SelectItem>
									<SelectItem value="SC">Scheduled Caste</SelectItem>
									<SelectItem value="ST">Scheduled Tribe</SelectItem>
									<SelectItem value="OBC">Other Backward Classes</SelectItem>
									<SelectItem value="EWS">Economic Wavier Scheme</SelectItem>{" "}
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>
				<div className="flex justify-center mt-4">
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? "Submitting..." : "Create Student"}
					</Button>
				</div>
			</div>
		</form>
	);
}
