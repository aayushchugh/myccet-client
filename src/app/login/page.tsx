"use client";
import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/common/logo";
import { useRouter } from "next/navigation";
import handleFormValidationErrors from "../../lib/handle-form-validation-errors";
import apiService from "../../services/api-service";

interface FormInput {
	email: string;
	password: string;
}

export default function LoginPage() {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<FormInput>();

	const onSubmit: SubmitHandler<FormInput> = async (data) => {
		try {
			const apiUrl = process.env.NEXT_PUBLIC_API_URL;
			if (!apiUrl) {
				throw new Error("API URL is not defined");
			}

			// Send login request
			const response = await apiService.post(`/auth/login`, data);

			// Log the response for debugging
			console.log("Login API Response:", response.data);

			// Extract token correctly
			const token = response?.data?.payload?.access_token;
			console.log("Extracted Token:", token); // Debugging log

			if (!token) {
				throw new Error("Token not provided in API response");
			}

			// Store token securely
			localStorage.setItem("token", token);
			console.log("Stored Token in Session:", localStorage.getItem("token")); // Debugging log

			// Navigate to admin page
			router.push("/admin");
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
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="min-h-dvh flex flex-col justify-center items-center"
		>
			<Card className="max-w-xl w-full">
				<CardHeader className="flex items-center justify-center mx-auto">
					<Logo />
				</CardHeader>
				<CardContent>
					<div className="grid w-full items-center gap-4">
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="Enter your email"
								{...register("email", {
									// required: "Email is required",
									// pattern: {
									// 	value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
									// 	message: "Enter a valid email address",
									// },
									setValueAs: (value) => value.trim(),
								})}
								className={errors.email ? "border-red-500" : ""}
							/>
							{errors.email && (
								<p className="text-red-500 text-sm">{errors.email.message}</p>
							)}
						</div>
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								placeholder="Password"
								{...register("password", {
									// required: "Password is required",
									// minLength: {
									// 	value: 6,
									// 	message: "Password must be at least 6 characters long",
									// },
								})}
								className={errors.password ? "border-red-500" : ""}
							/>
							{errors.password && (
								<p className="text-red-500 text-sm">{errors.password.message}</p>
							)}
						</div>
					</div>
				</CardContent>
				<CardFooter className="flex justify-center">
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? "Logging in..." : "Login"}
					</Button>
				</CardFooter>
			</Card>
		</form>
	);
}
