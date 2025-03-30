"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import apiService from "@/services/api-service";
import { Button } from "@/components/ui";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"; // Import Sonner

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface User {
	id: number;
	email: string;
	first_name: string;
	middle_name?: string;
	last_name: string;
	phone: number;
	designation: string;
}

export default function UserDetails() {
	const { id } = useParams();
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const {
		register,
		setValue,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			email: "",
			first_name: "",
			middle_name: "",
			last_name: "",
			phone: "",
			designation: "",
		},
	});

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await apiService.get(`/auth/me`);
				if (response.data && response.data.payload) {
					const userData = response.data.payload;
					setUser(userData);

					// Set form values
					Object.keys(userData).forEach((key) => {
						if (key in userData) {
							setValue(
								key as
									| "first_name"
									| "middle_name"
									| "last_name"
									| "email"
									| "phone"
									| "designation",
								userData[key],
							);
						}
					});
				} else {
					throw new Error("Invalid response format");
				}
			} catch {
				setError("Failed to load user data.");
				toast.error("Failed to load user data."); // Show toast on error
			} finally {
				setIsLoading(false);
			}
		};

		fetchUser();
	}, [id, setValue]);

	const handleUpdate = async (data: any) => {
		if (!user) return;
		try {
			const updatedUser = { ...user, ...data };

			await apiService.put(`/admin/${user.id}`, updatedUser);
			toast.success("User updated successfully");
			router.push("/admin/view"); // Redirect after save
		} catch (error) {
			console.error("Error updating user:", error);
			toast.error("Failed to update user data."); // Error toast
		}
	};

	const handleCancelEdit = () => {
		toast.info("Edit cancelled");
		router.push("/admin/view"); // Redirect after cancel
	};

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div className="text-red-500">{error}</div>;

	return (
		<div className="">
			<form onSubmit={handleSubmit(handleUpdate)}>
				<div className="space-y-4">
					{/* Required Fields */}
					<div>
						<Label htmlFor="email">Email</Label>
						<input
							className="w-full p-2 border rounded-md"
							{...register("email", { required: "Email is required" })}
							defaultValue={user?.email || ""}
						/>
						{errors.email && <p className="text-red-500">{errors.email.message}</p>}
					</div>

					<div>
						<Label htmlFor="first_name">First Name</Label>
						<input
							className="w-full p-2 border rounded-md"
							{...register("first_name", { required: "First name is required" })}
							defaultValue={user?.first_name || ""}
						/>
						{errors.first_name && (
							<p className="text-red-500">{errors.first_name.message}</p>
						)}
					</div>

					{/* Optional Fields */}
					<div>
						<Label htmlFor="middle_name">Middle Name</Label>
						<input
							className="w-full p-2 border rounded-md"
							{...register("middle_name")}
							defaultValue={user?.middle_name || ""}
						/>
					</div>

					<div>
						<Label htmlFor="last_name">Last Name </Label>
						<input
							className="w-full p-2 border rounded-md"
							{...register("last_name")}
							defaultValue={user?.last_name || ""}
						/>
					</div>

					{/* Required Fields */}
					<div>
						<Label htmlFor="phone">Phone</Label>
						<input
							className="w-full p-2 border rounded-md"
							{...register("phone", { required: "Phone is required" })}
							defaultValue={user?.phone || ""}
						/>
						{errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
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
									placeholder={user?.designation || "Select Branch"}
									{...register("designation", {
										required: "Designation is required",
									})}
								/>
							</SelectTrigger>

							<SelectContent>
								<SelectItem value="hod">HOD</SelectItem>
								<SelectItem value="tutor">Tutor</SelectItem>
								<SelectItem value="lecturer">Teacher</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className="flex gap-4 mt-6">
					<Button type="button" onClick={handleCancelEdit}>
						Go Back
					</Button>
					<Button type="submit">Save</Button>
				</div>
			</form>
		</div>
	);
}
