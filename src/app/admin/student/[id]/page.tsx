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
	branch: { id: number; title: string };
	semester: { id: number; title: string };
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
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [semesters, setSemesters] = useState<Semester[]>([]);
	const [currentSemesterTitle, setCurrentSemesterTitle] = useState("");

	const {
		register,
		setValue,
		handleSubmit,
		formState: { errors },
		watch,
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

	const semesterId = watch("semester_id");

	useEffect(() => {
		if (!id) return;

		const fetchUser = async () => {
			try {
				const response = await apiService.get(`/students/${id}`);
				if (response.data?.payload) {
					const userData = response.data.payload;
					setUser(userData);

					// Set form values
					Object.entries(userData).forEach(([key, value]) => {
						setValue(key as any, value);
					});

					setValue("branch_id", userData.branch?.id || 0);
					setValue("branch", userData.branch?.title || "");
					setValue("semester_id", userData.semester?.id || 0);
					setValue("semester", userData.semester?.title || "");
				}
			} catch (error) {
				setError("Failed to load user data.");
				toast.error("Failed to load user data.");
			} finally {
				setIsLoading(false);
			}
		};

		Promise.all([
			fetchUser(),
			apiService.get("/branches").then((res) => setBranches(res.data?.payload || [])),
			apiService.get("/semesters").then((res) => setSemesters(res.data?.payload || [])),
		]).catch((error) => {
			console.error("Error loading data:", error);
		});
	}, [id, setValue]);

	// Update semester title when semester ID changes
	useEffect(() => {
		if (semesterId) {
			const selectedSemester = semesters.find((sem) => sem.id === semesterId);
			if (selectedSemester) {
				setCurrentSemesterTitle(selectedSemester.title);
			}
		}
	}, [semesterId, semesters]);

	const handleUpdate = async (formData: any) => {
		if (!user) return;
		try {
			const updatedUser = {
				...formData,
				registration_number: Number(formData.registration_number) || 0,
				branch_id: Number(formData.branch_id) || 0,
				semester_id: Number(formData.semester_id) || 0,
				phone: Number(formData.phone) || 0,
			};

			await apiService.put(`/students/${user.id}`, updatedUser);
			toast.success("Student updated successfully");
			router.push("/admin/student");
		} catch (error) {
			console.error("Error updating Student:", error);
			toast.error("Failed to update student.");
		}
	};

	const handleDelete = async () => {
		if (!user) return;
		try {
			await apiService.delete(`/students/${user.id}`);
			toast.success("Student deleted successfully");
			router.push("/admin/student");
		} catch (error) {
			console.error("Error deleting student:", error);
			toast.error("Failed to delete student.");
		} finally {
			setIsDialogOpen(false);
		}
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
								Are you sure you want to delete this student? This action cannot be
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

					<div>
						<Label htmlFor="middle_name">Middle Name</Label>
						<input
							className="w-full p-2 border rounded-md"
							{...register("middle_name")}
							defaultValue={user?.middle_name || ""}
						/>
					</div>

					<div>
						<Label htmlFor="last_name">Last Name</Label>
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
						<Select onValueChange={(value) => setValue("category", value)}>
							<SelectTrigger error={errors?.category?.message}>
								<SelectValue
									placeholder={user?.category || "Select Category"}
									{...register("category", { required: "Category is required" })}
								/>
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="general">General</SelectItem>
								<SelectItem value="sc">Scheduled Caste</SelectItem>
								<SelectItem value="st">Scheduled Tribe</SelectItem>
							</SelectContent>
						</Select>
						{errors.category && (
							<p className="text-red-500">{errors.category.message}</p>
						)}
					</div>

					<div>
						<Label htmlFor="branch">Branch</Label>
						<Select onValueChange={(value) => setValue("branch_id", Number(value))}>
							<SelectTrigger error={errors?.branch_id?.message}>
								<SelectValue
									placeholder={user?.branch.title || "Select Branch"}
									{...register("branch", { required: "Branch is required" })}
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
									{...register("semester", { required: "Semester is required" })}
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
					<Button type="button" onClick={() => router.push("/admin/student")}>
						Go Back
					</Button>
					<Button type="submit">Save</Button>
				</div>
			</form>
		</div>
	);
}
