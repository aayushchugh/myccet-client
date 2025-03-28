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
	avatar: FileList;
	first_name: string;
	middle_name: string;
	last_name: string;
	email: string;
	phone: number;
	password: string;
	designation: string;
	branch_id: number;
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
			// Send request with token using apiService
			await apiService.post("/faculty", data);

			toast.success("Faculty Created!");
			router.push("/admin/faculty");
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
				<div className="flex flex-col space-y-1.5 pb-3">
					<Label htmlFor="avatar">Avatar</Label>
					<Input
						id="avatar"
						type="file"
						error={errors.avatar?.message}
						{...register("avatar")}
					/>
				</div>

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
					<div className="grid grid-cols-2 gap-3">
						<div>
							<Label required htmlFor="designation">
								Designation
							</Label>
							<Select
								onValueChange={(value) => {
									setValue("designation", value);
								}}
							>
								<SelectTrigger error={errors?.designation?.message}>
									<SelectValue
										placeholder={"Select designation"}
										{...register("designation", {
											required: "Designation is required",
										})}
									/>
								</SelectTrigger>

								<SelectContent>
									<SelectItem value="hod">HOD</SelectItem>
									<SelectItem value="tutor">Tutor</SelectItem>
									<SelectItem value="lecturer">Teacher</SelectItem>
								</SelectContent>
							</Select>
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
