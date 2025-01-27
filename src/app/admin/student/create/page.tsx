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

interface FormInput {
	avatar: FileList;
	firstName: string;
	middleName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	fatherName: string;
	motherName: string;
}

export default function TeacherRegistrationForm() {
	const {
		register,
		handleSubmit,
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
							{...register("firstName", { required: "First name is required" })}
						/>
						{errors.firstName && (
							<span style={{ color: "red" }}>{errors.firstName.message}</span>
						)}
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
						<Input id="lastName" placeholder="Last Name" {...register("lastName")} />
						{errors.lastName && (
							<span style={{ color: "red" }}>{errors.lastName.message}</span>
						)}
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
						{...register("email", {
							required: "Email is required",
							pattern: {
								value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
								message: "Enter a valid email address",
							},
						})}
					/>
					{errors.email && <span style={{ color: "red" }}>{errors.email.message}</span>}
				</div>

				<div className="flex flex-col space-y-1.5">
					<Label required htmlFor="phoneNumber">
						Phone Number
					</Label>
					<Input
						id="phoneNumber"
						type="tel"
						placeholder="Phone Number"
						{...register("phoneNumber", {
							required: "Phone number is required",
						})}
					/>
					{errors.phoneNumber && (
						<span style={{ color: "red" }}>{errors.phoneNumber.message}</span>
					)}
				</div>
				<div className="flex flex-col space-y-1.5">
					<Label required htmlFor="fatherName">
						Fathers Name
					</Label>
					<Input
						id="fatherName"
						placeholder="Fathers Name"
						{...register("fatherName", { required: "Role is required" })}
					/>
					{errors.fatherName && (
						<span style={{ color: "red" }}>{errors.fatherName.message}</span>
					)}
				</div>
				<div className="flex flex-col space-y-1.5">
					<Label required htmlFor="motherName">
						Mothers Name
					</Label>
					<Input
						id="motherName"
						placeholder="Mothers Name"
						{...register("motherName", { required: "Role is required" })}
					/>
					{errors.motherName && (
						<span style={{ color: "red" }}>{errors.motherName.message}</span>
					)}
				</div>
				<div className="grid grid-cols-4 gap-2">
					<div>
						<Select>
							<SelectTrigger>
								<SelectValue placeholder="Category" />
							</SelectTrigger>

							<SelectContent>
								<SelectItem value="GEN">General</SelectItem>
								<SelectItem value="SC">SC(Scheduled Caste)</SelectItem>
								<SelectItem value="ST">SC(Scheduled Tribe)</SelectItem>
								<SelectItem value="OBC">OBC(Other Backward Caste)</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div>
						<Select>
							<SelectTrigger>
								<SelectValue placeholder="Branch" />
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
					<div>
						<Select>
							<SelectTrigger>
								<SelectValue placeholder="Semester" />
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
					<div>
						<Select>
							<SelectTrigger>
								<SelectValue placeholder="Type" />
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
			</div>
		</form>
	);
}
