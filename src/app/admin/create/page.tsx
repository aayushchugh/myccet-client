"use client";
import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import handleFormValidationErrors from "@/lib/handle-form-validation-errors";
import apiService from "@/services/api-service";
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
	last_name: string;
	email: string;
	phone: number;
	password: string;
	designation: string;
}

export default function TeacherRegistrationForm() {
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
			const apiUrl = process.env.NEXT_PUBLIC_API_URL;
			if (!apiUrl) {
				throw new Error("API URL is not defined");
			}

			// Retrieve token from localStorage
			const token = localStorage.getItem("token");

			if (!token) {
				throw new Error("User is not authenticated. Please log in first.");
			}

			// Send request with token
			const response = await apiService.post(`/admin`, data, {
				withCredentials: true,
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			console.log("API Response:", response.data);
			alert("Registration successful!");
		} catch (error: any) {
			if (
				error.response.status === 400 ||
				error.response.status === 401 ||
				error.response.status === 404
			) {
				handleFormValidationErrors(error.response.data.errors, setError);
			}

			if (error.response.status === 500) {
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
								placeholder="First Name"
								error={errors.first_name?.message}
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
							<Label required htmlFor="lastName">
								Last Name
							</Label>
							<Input
								id="lastName"
								placeholder="Last Name"
								error={errors.last_name?.message}
								{...register("last_name", { required: "Last name is required" })}
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
						<Label required htmlFor="phoneNumber">
							Phone Number
						</Label>
						<Input
							id="phoneNumber"
							type="number"
							placeholder="Phone Number"
							error={errors.phone?.message}
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
							placeholder="Password"
							error={errors.password?.message}
							{...register("password", {
								required: "Password is required",
								minLength: {
									value: 6,
									message: "Password must be at least 6 characters long",
								},
							})}
							className={errors.password ? "border-red-500" : ""}
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
								<SelectItem value="Principal">Principal</SelectItem>
								<SelectItem value="HOD">HOD</SelectItem>
								<SelectItem value="Tutor">Tutor</SelectItem>
								<SelectItem value="Teacher">Teacher</SelectItem>
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
