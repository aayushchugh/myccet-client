"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import apiService from "@/services/api-service";
import { Button } from "@/components/ui";
import { toast } from "sonner";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";

interface User {
	id: number;
	email: string;
	first_name: string;
	middle_name?: string; // Optional
	last_name?: string; // Optional
	phone: string;
	designation: string;
	branch_id: number;
}

interface Branch {
	id: number;
	title: string;
}

export default function UserDetails() {
	const { id } = useParams();
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [branches, setBranches] = useState<Branch[]>([]);

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
			branch_id: "",
		},
	});

	useEffect(() => {
		if (!id) return;

		const fetchUser = async () => {
			try {
				const response = await apiService.get(`/faculty/${id}`);
				if (response.data && response.data.payload) {
					const userData = response.data.payload;
					setUser(userData);

					// Set form values
					Object.keys(userData).forEach((key) => {
						if (key in userData) {
							setValue(key as keyof User, userData[key]);
						}
					});
				} else {
					throw new Error("Invalid response format");
				}
			} catch {
				setError("Failed to load user data.");
				toast.error("Failed to load user data.");
			} finally {
				setIsLoading(false);
			}
		};

		const fetchBranches = async () => {
			try {
				const response = await apiService.get("/branches");
				if (response.data && response.data.payload) {
					setBranches(response.data.payload);
				} else {
					console.error("Invalid branches format");
				}
			} catch (error) {
				console.error("Network error:", error);
				toast.error("Failed to load branches.");
			}
		};

		fetchUser();
		fetchBranches();
	}, [id, setValue]);

	const handleUpdate = async (data: any) => {
		if (!user) return;
		try {
			const updatedUser = {
				...user,
				...data,
				branch_id: Number(data.branch_id),
			};

			await apiService.put(`/faculty/${user.id}`, updatedUser);
			toast.success("User updated successfully");
			router.push("/admin/faculty"); // Redirect after save
		} catch (error) {
			console.error("Error updating user:", error);
			toast.error("Failed to update user.");
		}
	};

	const handleCancelEdit = () => {
		toast.info("Edit cancelled");
		router.push("/admin/faculty"); // Redirect after cancel
	};

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div className="text-red-500">{error}</div>;

	return (
		<div className="p-6">
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
						<Label htmlFor="designation">Designation</Label>
						<input
							className="w-full p-2 border rounded-md"
							{...register("designation", { required: "Designation is required" })}
							defaultValue={user?.designation || ""}
						/>
						{errors.designation && (
							<p className="text-red-500">{errors.designation.message}</p>
						)}
					</div>

					{/* Branch Dropdown */}
					<div>
						<Label htmlFor="branch">Branch</Label>
						<Select onValueChange={(value) => setValue("branch_id", value)}>
							<SelectTrigger error={errors?.branch_id?.message}>
								<SelectValue
									placeholder="Select Branch"
									{...register("branch_id", { required: "Branch is required" })}
								/>
							</SelectTrigger>

							<SelectContent>
								{branches.map((branch) => (
									<SelectItem key={branch.id} value={branch.id.toString()}>
										{branch.title}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{errors.branch_id && (
							<p className="text-red-500">{errors.branch_id.message}</p>
						)}
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
