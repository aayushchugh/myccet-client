"use client";
import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/common/logo";
import { useRouter } from "next/navigation";

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

			const response = await axios.post(`${apiUrl}/auth/login`, data, {
				withCredentials: true,
				headers: { "Content-Type": "application/json" },
			});

			console.log("Login API Response:", response.data);

			const token = response?.data?.payload?.access_token;
			if (!token) {
				throw new Error("Token not provided in API response");
			}

			localStorage.setItem("token", token);
			router.push("/admin");
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				const { status, data } = error.response;

				if (status === 404) {
					setError("email", { type: "server", message: data.message });
				} else if (status === 401) {
					setError("password", { type: "server", message: data.message });
				} else {
					setError("email", {
						type: "server",
						message: "An unexpected error occurred. Please try again.",
					});
				}
			} else {
				setError("email", { type: "server", message: "Network error. Try again later." });
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
									required: "Email is required",
									pattern: {
										value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
										message: "Enter a valid email address",
									},
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
									required: "Password is required",
									minLength: {
										value: 6,
										message: "Password must be at least 6 characters long",
									},
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
