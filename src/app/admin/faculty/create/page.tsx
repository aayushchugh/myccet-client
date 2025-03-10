"use client";
import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CiEdit } from "react-icons/ci";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface FormInput {
	avatar: FileList;
	firstName: string;
	middleName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	password: string;
	designation: string;
}

export default function TeacherRegistrationForm() {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<FormInput>();
	const onSubmit: SubmitHandler<FormInput> = (data) => console.log(data);

	return (
		<div>
			<div className="flex flex-col space-y-1.5 pb-3">
				<Label htmlFor="avatar" required>
					Avatar
				</Label>
				<Input
					required
					id="avatar"
					type="file"
					error={errors.avatar?.message}
					{...register("avatar", { required: "Avatar is required" })}
				/>
				<div>
					<CiEdit />
				</div>
			</div>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="min-h-dvh flex flex-col  w-full place-items-center "
			>
				<div className="grid gap-4 w-full ">
					<div className="grid grid-cols-3 gap-4">
						<div className="flex flex-col space-y-1.5">
							<Label required htmlFor="firstName">
								First Name
							</Label>
							<Input
								id="firstName"
								placeholder="First Name"
								error={errors.firstName?.message}
								{...register("firstName", { required: "First name is required" })}
							/>
						</div>
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="middleName">Middle Name</Label>
							<Input
								id="middleName"
								placeholder="Middle Name"
								{...register("middleName")}
							/>
						</div>
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="lastName">Last Name</Label>
							<Input
								id="lastName"
								placeholder="Last Name"
								{...register("lastName")}
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
							type="tel"
							placeholder="Phone Number"
							error={errors.phoneNumber?.message}
							{...register("phoneNumber", {
								required: "Phone number is required",
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
					<Button type="submit">Register</Button>
				</div>
			</form>
		</div>
	);
}
