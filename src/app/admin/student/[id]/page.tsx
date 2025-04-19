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
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

interface User {
	id: number;
	registration_number: number;
	father_name: string;
	first_name: string;
	middle_name: string;
	last_name: string;
	mother_name: string;
	category: string;
	phone: number;
	branch_id: number;
	branch: any;
	semester: any;
	semester_id: number;
	email: string;
}

interface Branch {
	id: number;
	title: string;
}
interface Semester {
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
	const [semesters, setSemesters] = useState<Branch[]>([]);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const {
		register,
		setValue,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			registration_number: 0,
			father_name: "",
			first_name: "",
			middle_name: "",
			last_name: "",
			mother_name: "",
			category: "",
			branch_id: 0,
			branch: "",
			semester: "",
			semester_id: 0,
			phone: 0,
			email: "",
		},
	});

	useEffect(() => {
		if (!id) return;

		const fetchUser = async () => {
			try {
				const response = await apiService.get(`/students/${id}`);
				if (response.data && response.data.payload) {
					const userData = response.data.payload;
					setUser(userData);
					setValue("branch_id", userData.branch?.id || 0);
					setValue("branch", userData.branch?.title || "");
					setValue("semester_id", userData.semester?.id || 0);
					setValue("semester", userData.semester?.title || "");

					// Set form values
					Object.keys(userData).forEach((key) => {
						if (key in userData) {
							setValue(key as any, userData[key]);
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
		const fetchSemesters = async () => {
			try {
				const response = await apiService.get("/semesters");
				if (response.data && response.data.payload) {
					setSemesters(response.data.payload);
				} else {
					console.error("Invalid semester format");
				}
			} catch (error) {
				console.error("Network error:", error);
				toast.error("Failed to load semester.");
			}
		};

		fetchUser();
		fetchBranches();
		fetchSemesters();
	}, [id, setValue]);

	const handleUpdate = async (data: any) => {
		if (!user) return;
		try {
			const updatedUser = {
				...user,
				...data,
				registration_number: Number(data.registration_number) || 0, // Convert to number
				branch_id: Number(data.branch_id) || 0, // Convert to number
				semester_id: Number(data.semester_id) || 0,
			};

			await apiService.put(`/students/${user.id}`, updatedUser);
			toast.success("Student updated successfully");
			router.push("/admin/student"); // Redirect after save
		} catch (error) {
			console.error("Error updating Student:", error);
			toast.error("Failed to update user.");
		}
	};
	const handleDelete = async () => {
		if (!user) return;

		try {
			await apiService.delete(`/students/${user.id}`);
			toast.success("Student deleted successfully");
			router.push("/admin/student"); // Redirect after delete
		} catch (error) {
			console.error("Error deleting user:", error);
			toast.error("Failed to delete user.");
		} finally {
			setIsDialogOpen(false); // Close dialog
		}
	};

	const handleCancelEdit = () => {
		toast.info("Edit cancelled");
		router.push("/admin/student"); // Redirect after cancel
	};

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div className="text-red-500">{error}</div>;

	return (
		<div className="p-6">
			<div className="flex justify-end">
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger asChild>
						<Button className="bg-red-500 hover:bg-red-700">Delete</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Confirm Deletion</DialogTitle>
							<DialogDescription>
								Are you sure you want to delete this user? This action cannot be
								undone.
							</DialogDescription>
						</DialogHeader>
						<div className="flex justify-end gap-4">
							<Button onClick={() => setIsDialogOpen(false)} variant="outline">
								Cancel
							</Button>
							<Button className="bg-red-500 hover:bg-red-700" onClick={handleDelete}>
								Confirm
							</Button>
						</div>
					</DialogContent>
				</Dialog>
			</div>
			<form onSubmit={handleSubmit(handleUpdate)}>
				<div className="space-y-4">
					<div>
						<Label htmlFor="registration_number">Registration Number</Label>
						<input
							className="w-full p-2 border rounded-md"
							{...register("registration_number", {
								required: "Registration number is required",
							})}
						/>
						{errors.registration_number && (
							<p className="text-red-500">{errors.registration_number.message}</p>
						)}
					</div>
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
						<Label htmlFor="phone">Phone</Label>
						<input
							className="w-full p-2 border rounded-md"
							{...register("phone", { required: "Phone is required" })}
							defaultValue={user?.phone || ""}
						/>
						{errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
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

					<div>
						<Label htmlFor="father_name">Father's Name</Label>
						<input
							className="w-full p-2 border rounded-md"
							{...register("father_name", { required: "Father's name is required" })}
						/>
						{errors.father_name && (
							<p className="text-red-500">{errors.father_name.message}</p>
						)}
					</div>

					<div>
						<Label htmlFor="mother_name">Mother's Name</Label>
						<input
							className="w-full p-2 border rounded-md"
							{...register("mother_name", { required: "Mother's name is required" })}
						/>
						{errors.mother_name && (
							<p className="text-red-500">{errors.mother_name.message}</p>
						)}
					</div>

					<div>
						<Label required htmlFor="category">
							Category
						</Label>
						<Select
							onValueChange={(value) => {
								setValue("category", value);
							}}
						>
							<SelectTrigger error={errors?.category?.message}>
								<SelectValue
									placeholder={user?.category || "Select Branch"}
									{...register("category", {
										required: "Category is required",
									})}
								/>
							</SelectTrigger>

							<SelectContent>
								<SelectItem value="hod">General</SelectItem>
								<SelectItem value="tutor">Scheduled Caste</SelectItem>
								<SelectItem value="lecturer">Scheduled Tribe</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div>
						<Label htmlFor="branch">Branch</Label>
						<Select onValueChange={(value) => setValue("branch_id", Number(value))}>
							<SelectTrigger error={errors?.branch_id?.message}>
								<SelectValue
									placeholder={user?.branch.title || "Select Branch"}
									{...register("branch", {
										required: "Branch is required",
									})}
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
					<div>
						<Label htmlFor="semester">Semester</Label>
						<Select onValueChange={(value) => setValue("semester_id", Number(value))}>
							<SelectTrigger error={errors?.semester_id?.message}>
								<SelectValue
									placeholder={user?.semester.title || "Select Semester"}
									{...register("semester", {
										required: "Semester is required",
									})}
								/>
							</SelectTrigger>

							<SelectContent>
								{semesters.map((semester) => (
									<SelectItem key={semester.id} value={semester.id.toString()}>
										{semester.title}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{errors.semester_id && (
							<p className="text-red-500">{errors.semester_id.message}</p>
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
