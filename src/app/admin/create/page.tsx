"use client";
import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

		formState: { errors, isSubmitting },
	} = useForm<FormInput>();

	const onSubmit: SubmitHandler<FormInput> = async (data) => {
		data.phone = Number(data.phone);
		console.log("Submitting Data:", data);

		try {
			// Retrieve token from session storage
			const token = localStorage.getItem("token");
			console.log("Token:", token);

			if (!token) {
				throw new Error("User is not authenticated. Please log in first.");
			}

			// Send request with token
			const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/admin`, data, {
				withCredentials: true,
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`, // Add token here
				},
			});

			console.log("API Response:", response.data);
			alert("Registration successful!");
		} catch (error) {
			console.error("❌ API Error:", error);

			if (axios.isAxiosError(error) && error.response) {
				console.log("📢 Server Response:", error.response.data);
				alert(`Error: ${JSON.stringify(error.response.data)}`);
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
						/>
					</div>
					<div className="flex flex-col space-y-1.5">
						<Label required htmlFor="designation">
							Designation
						</Label>
						<Input
							id="designation"
							placeholder="Enter Designation"
							error={errors.designation?.message}
							{...register("designation", { required: "Designation is required" })}
						/>
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
