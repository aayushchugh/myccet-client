"use client";
import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
// import Link from "next/link";

interface FormInput {
	avatar: FileList;
	firstName: string;
	middleName: string;
	lastName: string;
	registration: string;
	email: string;
	phoneNumber: string;
	fatherName: string;
	motherName: string;
	category: string;
	branch: string;
	semester: string;
	courseType: string;
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
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="min-h-dvh flex flex-col justify-center items-center"
		>
			<div className="grid gap-4 w-full max-w-3xl">
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
							error={errors.lastName?.message}
							{...register("lastName")}
						/>
					</div>
				</div>
				<div className="flex flex-col space-y-1.5">
					<Label required htmlFor="registration">
						Registration number
					</Label>
					<Input
						id="registration"
						type="text"
						placeholder="Enter your registration number"
						error={errors.registration?.message}
						{...register("registration", {
							required: "registration number is required",
							pattern: {
								value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
								message: "Enter a valid registration number",
							},
						})}
					/>
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
					<Label required htmlFor="fatherName">
						Fathers Name
					</Label>
					<Input
						id="fatherName"
						placeholder="Fathers Name"
						error={errors.fatherName?.message}
						{...register("fatherName", { required: "Role is required" })}
					/>
				</div>
				<div className="flex flex-col space-y-1.5">
					<Label required htmlFor="motherName">
						Mothers Name
					</Label>
					<Input
						id="motherName"
						placeholder="Mothers Name"
						error={errors.motherName?.message}
						{...register("motherName", { required: "Role is required" })}
					/>
				</div>
				<div className="grid grid-cols-4 gap-2">
					<div className="flex flex-col space-y-1.5">
						<Label required htmlFor="category">
							Category
						</Label>
						<Input
							id="registration"
							type="text"
							placeholder="Enter your registration number"
							error={errors.registration?.message}
							{...register("registration", {
								required: "registration number is required",
								pattern: {
									value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
									message: "Enter a valid registration number",
								},
							})}
						/>
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
						<Label required htmlFor="Branch">
							Branch
						</Label>
						<Select
							onValueChange={(value) => {
								setValue("branch", value);
							}}
						>
							<SelectTrigger error={errors?.branch?.message}>
								<SelectValue
									placeholder={"Select Branch"}
									{...register("branch", { required: "Branch is required" })}
								/>
							</SelectTrigger>

							<SelectContent>
								<SelectItem value="CSE">Computer Science Engg.</SelectItem>
								<SelectItem value="ECE">
									Electronics & Communication Engg.
								</SelectItem>
								<SelectItem value="ME">Mech Engg.</SelectItem>
								<SelectItem value="EE">Elec Engg.</SelectItem>
								<SelectItem value="CE">Civil Engg.</SelectItem>
								<SelectItem value="PE">Prod Engg.</SelectItem>
								<SelectItem value="AA">Arch Assistanship</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="flex flex-col space-y-1.5">
						<Label required htmlFor="semester">
							Semester
						</Label>
						<Select
							onValueChange={(value) => {
								setValue("semester", value);
							}}
						>
							<SelectTrigger error={errors?.semester?.message}>
								<SelectValue
									placeholder={"Select Semester"}
									{...register("semester", { required: "Semester is required" })}
								/>
							</SelectTrigger>

							<SelectContent>
								<SelectItem value="1">1</SelectItem>
								<SelectItem value="2">2</SelectItem>
								<SelectItem value="3">3</SelectItem>
								<SelectItem value="4">4</SelectItem>
								<SelectItem value="5">5</SelectItem>
								<SelectItem value="6">6</SelectItem>
								<SelectItem value="7">7</SelectItem>
								<SelectItem value="8">8</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
				<div className="flex flex-col space-y-1.5">
					<Label required htmlFor="registration">
						Registration number
					</Label>
					<Input
						id="registration"
						type="text"
						placeholder="Enter your registration number"
						error={errors.registration?.message}
						{...register("registration", {
							required: "registration number is required",
							pattern: {
								value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
								message: "Enter a valid registration number",
							},
						})}
					/>
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
					<Label required htmlFor="fatherName">
						Fathers Name
					</Label>
					<Input
						id="fatherName"
						placeholder="Fathers Name"
						error={errors.fatherName?.message}
						{...register("fatherName", { required: "Role is required" })}
					/>
				</div>
				<div className="flex flex-col space-y-1.5">
					<Label required htmlFor="motherName">
						Mothers Name
					</Label>
					<Input
						id="motherName"
						placeholder="Mothers Name"
						error={errors.motherName?.message}
						{...register("motherName", { required: "Role is required" })}
					/>
				</div>
				<div className="grid grid-cols-4 gap-2">
					<div className="flex flex-col space-y-1.5">
						<Label required htmlFor="courseType">
							Course Type
						</Label>
						<Select
							onValueChange={(value) => {
								setValue("courseType", value);
							}}
						>
							<SelectTrigger error={errors?.courseType?.message}>
								<SelectValue
									placeholder={"Select Course Type"}
									{...register("courseType", {
										required: "Course Type is required",
									})}
								/>
							</SelectTrigger>

							<SelectContent>
								<SelectItem value="m@example.com">Full Time Diploma</SelectItem>
								<SelectItem value="m@google.com">Part Time Diploma</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>
			<div className="flex justify-center mt-4">
				<Button type="submit">Register</Button>
				{/* <Link href={"/admin"}>
					<Button>Register</Button>
				</Link> */}
			</div>
		</form>
	);
}
