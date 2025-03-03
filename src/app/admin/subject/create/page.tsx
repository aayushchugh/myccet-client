"use client";
import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormInput {
	subject_code: number;
	subject_name: string;
}

export default function TeacherRegistrationForm() {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<FormInput>();

	const onSubmit: SubmitHandler<FormInput> = async (data) => {
		console.log("Form submitted:", data);
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
						{...register("subject_code", {
							required: "Subject code is required",
							valueAsNumber: true,
						})}
					/>
					{errors.subject_code && (
						<p className="text-red-500 text-sm">{errors.subject_code.message}</p>
					)}
				</div>

				<div className="flex flex-col space-y-1.5">
					<Label htmlFor="subject_name">
						Subject Name <span className="text-red-500">*</span>
					</Label>
					<Input
						id="subject_name"
						type="text"
						placeholder="Enter Subject Name"
						{...register("subject_name", {
							required: "Subject name is required",
							minLength: {
								value: 3,
								message: "Subject name must be at least 3 characters long",
							},
						})}
					/>
					{errors.subject_name && (
						<p className="text-red-500 text-sm">{errors.subject_name.message}</p>
					)}
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
