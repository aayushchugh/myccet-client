"use client";
import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/common/logo";
import Link from "next/link";

interface FormInput {
	email: string;
	password: string;
}

export default function LoginPage() {
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<FormInput>();

	const onSubmit: SubmitHandler<FormInput> = async (data) => {
		console.log(data.email);
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});
			console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || "Login failed");
			}

			alert("Login successful!");
			return <Link href="/">Dashboard</Link>;
		} catch (error) {
			if (error instanceof Error) {
				setError("email", { type: "server", message: error.message });
			} else {
				setError("email", { type: "server", message: "An unknown error occurred" });
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
								error={errors.email?.message}
								placeholder="Enter your email"
								{...register("email", {
									required: "Email is required",
									pattern: {
										value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
										message: "Enter a valid email address",
									},
									setValueAs: (value) => value.trim(),
								})}
							/>
						</div>
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="password">Password</Label>
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
					</div>
				</CardContent>
				<CardFooter className="flex justify-center">
					<Button type="submit">Login</Button>
				</CardFooter>
			</Card>
		</form>
	);
}
