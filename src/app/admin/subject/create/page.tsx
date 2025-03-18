"use client";
import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import apiService from "@/services/api-service"; // Import your apiService
import handleFormValidationErrors from "@/lib/handle-form-validation-errors"; // Ensure this utility exists
import { toast } from "sonner"; // Import toast for displaying error messages
import { useRouter } from "next/navigation"; // Import useRouter for redirecting

interface FormInput {
	title: string;
	code: string;
}

export default function TeacherRegistrationForm() {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<FormInput>();

	const onSubmit: SubmitHandler<FormInput> = async (data) => {
		data.code = String(data.code);
		try {
			// Send request with token using apiService
			await apiService.post("/subjects", data);

			toast.success("Subject Created!");
			router.push("/admin/subject");
		} catch (error: any) {
			console.error("❌ API Error:", error);

			if (error.response) {
				console.log(" Server Response:", error.response.data);

				// Handle 409 Conflict errors
				if (error.response.status === 409) {
					const errorMessage =
						error.response.data.message || "Subject Code already in use.";
					toast.error(errorMessage);

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
			<div className="grid gap-4 w-full max-w-md">
				<div className="flex flex-col space-y-1.5">
					<Label htmlFor="subject_code">
						Subject Code <span className="text-red-500">*</span>
					</Label>
					<Input
						id="subject_code"
						type="number"
						placeholder="Enter Subject Code"
						{...register("code", {
							required: "Subject code is required",
							valueAsNumber: true,
						})}
					/>
					{errors.code && <p className="text-red-500 text-sm">{errors.code.message}</p>}
				</div>

				<div className="flex flex-col space-y-1.5">
					<Label htmlFor="subject_name">
						Subject Name <span className="text-red-500">*</span>
					</Label>
					<Input
						id="subject_name"
						type="text"
						placeholder="Enter Subject Name"
						{...register("title", {
							required: "Subject name is required",
							minLength: {
								value: 3,
								message: "Subject name must be at least 3 characters long",
							},
						})}
					/>
					{errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
				</div>

				<div className="flex justify-center mt-4">
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? "Submitting..." : "Create Admin"}
					</Button>
				</div>
			</div>
		</form>
	);
}
