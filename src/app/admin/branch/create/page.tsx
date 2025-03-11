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
	branch: string;
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
		try {
			// Send request with token using apiService
			const response = await apiService.post("/branches", data, {});

			console.log("API Response:", response.data);
			toast.success("Branch Created!");
			router.push("/admim/branche/view");
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
			<div className="flex flex-col space-y-1.5">
				<Label htmlFor="subject_name">
					Branch Name <span className="text-red-500">*</span>
				</Label>
				<Input
					id="branch_name"
					type="text"
					placeholder="Enter Branch Name"
					{...register("branch", {
						required: "Branch name is required",
						minLength: {
							value: 3,
							message: "Branch name must be at least 3 characters long",
						},
					})}
				/>
				{errors.branch && <p className="text-red-500 text-sm">{errors.branch.message}</p>}
			</div>

			<div className="flex justify-center mt-4">
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? "Submitting..." : "Create Admin"}
				</Button>
			</div>
		</form>
	);
}
