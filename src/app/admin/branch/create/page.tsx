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
			await apiService.post("/branches", data);

			toast.success("Branch Created!");
			router.push("/admin/branch");
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
			<div className="flex flex-col space-y-1.5">
				<Label htmlFor="subject_name">
					Branch Name <span className="text-red-500">*</span>
				</Label>
				<Input
					id="branch_name"
					type="text"
					placeholder="Enter Branch Name"
					{...register("title", {
						required: "Branch name is required",
						minLength: {
							value: 3,
							message: "Branch name must be at least 3 characters long",
						},
					})}
				/>
				{errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
			</div>

			<div className="flex justify-center mt-4">
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? "Submitting..." : "Create Branch"}
				</Button>
			</div>
		</form>
	);
}
