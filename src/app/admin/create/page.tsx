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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface FormInput {
	first_name: string;
	middle_name?: string;
	last_name?: string;
	email: string;
	phone: number;
	password: string;
	designation: string;
}

export default function TeacherRegistrationForm() {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		setError,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<FormInput>();
	const onSubmit: SubmitHandler<FormInput> = async (data) => {
		data.phone = Number(data.phone);

		try {
			// Retrieve token from localStorage
			const token = localStorage.getItem("token");

			if (!token) {
				toast.error("You are not authenticated. Please log in first.");
				router.push("/login"); // Redirect to login page
				return;
			}

			// Send request with token using apiService
			const response = await apiService.post("/admin", data, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			console.log("API Response:", response.data);
			toast.success("Registration successful!");
			router.push("/admin/view");
		} catch (error: any) {
			console.error("❌ API Error:", error);

			if (error.response) {
				console.log("📢 Server Response:", error.response.data);

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
		<div>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="min-h-dvh flex flex-col w-full place-items-center"
			>
				<div className="grid gap-4 w-full">
					<div className="grid grid-cols-3 gap-4">
						<div className="flex flex-col space-y-1.5">
							<Label required htmlFor="firstName">
								First Name
							</Label>
							<Input
								id="firstName"
								error={errors?.first_name?.message}
								placeholder="First Name"
								{...register("first_name", { required: "First name is required" })}
							/>
						</div>
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="middleName">Middle Name</Label>
							<Input
								id="middleName"
								placeholder="Middle Name"
								{...register("middle_name")}
							/>
						</div>
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="lastName">Last Name</Label>
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
							error={errors?.email?.message}
							placeholder="Enter your email"
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
						<Label required htmlFor="phoneNumber">
							Phone Number
						</Label>
						<Input
							id="phoneNumber"
							type="number"
							error={errors?.phone?.message}
							placeholder="Phone Number"
							{...register("phone", { required: "Phone number is required" })}
						/>
					</div>
					<div className="flex flex-col space-y-1.5">
						<Label required htmlFor="password">
							Password
						</Label>
						<Input
							id="password"
							type="password"
							error={errors?.password?.message}
							placeholder="Password"
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
								<SelectItem value="principal">Principal</SelectItem>

								<SelectItem value="maintenance">Maintenance</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
				<div className="flex justify-center mt-4">
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? "Submitting..." : "Create Admin"}
					</Button>
				</div>
			</form>
		</div>
	);
}
