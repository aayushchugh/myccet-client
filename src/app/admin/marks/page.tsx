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
	branch_id: number;
	registration_number: number;
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

	const [branches, setBranches] = React.useState<{ id: number; title: string }[]>([]);

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
								<SelectItem value="1">1</SelectItem>
								<SelectItem value="2">2</SelectItem>
								<SelectItem value="3">1</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
				<div className="flex justify-center mt-4">
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? "Submitting..." : "Create Faculty"}
					</Button>
				</div>
			</div>
		</form>
	);
}
