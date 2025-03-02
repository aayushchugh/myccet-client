"use client";
import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Label } from "@/components/ui/label";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
// import { useState } from "react";
// import Link from "next/link";

interface FormInput {
	avatar: FileList;
	firstName: string;
	middleName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
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

	// const [percentage, setPercentage] = useState(null);

	return (
		<div>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="min-h-dvh flex flex-col justify-center items-center"
			>
				<div className="grid gap-4 w-full max-w-3xl">
					<div className="grid grid-cols-5 gap-4  ">
						<div className="col-start-1 col-end-5 space-y-1.5">
							<div className="flex flex-col space-y-1.5">
								<Label required htmlFor="firstName">
									First Name
								</Label>
								<Input
									id="firstName"
									placeholder="First Name"
									error={errors.firstName?.message}
									{...register("firstName", {
										required: "First name is required",
									})}
								/>
							</div>
							<div className="flex flex-col space-y-1.5 ">
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
						<div>
							<Image
								src="/logo.svg"
								width={175}
								height={150}
								alt=" "
								className=" rounded-2xlc col-span-2 col-end-7 "
							></Image>
							<Input
								id="avatar"
								type="file"
								accept="image/*"
								className="mt-1"
								{...register("avatar", {
									required: "Avatar is required",
								})}
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

					<div className="grid grid-cols-4 gap-2">
						<div className="flex flex-col space-y-1.5">
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
										placeholder={"Select Designation"}
										{...register("designation", {
											required: "Designation is required",
										})}
									/>
								</SelectTrigger>

								<SelectContent>
									<SelectItem value="Principal">Principal</SelectItem>

									<SelectItem value="maintenance">Maintenance</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>
				<div className="flex justify-center mt-4">
					<Button type="submit">Submit</Button>
					{/* <Link href={"/admin"}>
					<Button>Register</Button>
				</Link> */}
				</div>
			</form>
		</div>
	);
}
