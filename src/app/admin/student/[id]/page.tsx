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

	batch: { id: number; title: string; type: string };
	semester: { id: number; title: string };
	current_semester_id: number;
	batch_id: number;
	email: string;
}

export default function UserDetails() {
	const { id } = useParams();
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [batch, setBatch] = useState<
		{ id: number; title: string; type: string; start_year: any; end_year: any }[]
	>([]);
	const [semesters, setSemesters] = useState<
		{ id: number; title: string; start_date: string; end_date: string }[]
	>([]);
	const formatDate = (DateString: string) => {
		const date = new Date(DateString);
		if (isNaN(date.getTime())) return DateString;
		const year = date.getFullYear();

		return `${year}`;
	};
	const formatBatchInfo = (batch) => {
		if (!batch) return "Select Batch";

		const startYear = batch.start_year ? formatDate(batch.start_year) : "";
		const endYear = batch.end_year ? formatDate(batch.end_year) : "";
		const yearRange = startYear && endYear ? `${startYear}-${endYear}` : "";
		const batchType = batch.type || "";
		const branchName = batch.title || "";

		return `${yearRange} ${batchType} ${branchName}`.trim();
	};

	const [isDialogOpen, setIsDialogOpen] = useState(false);

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
			batch_id: 0,
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

					setValue("batch_id", userData.batch?.id || 0);
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
		const fetchBatches = async () => {
			try {
				const response = await apiService.get("/batch");

				if (response) {
					setBatch(response.data.payload);
				} else {
					console.error("Error fetching branches:");
				}
			} catch (error) {
				console.error("Network error:", error);
			}
		};
		fetchUser();
		fetchBatches();
	}, [id, setValue]);

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
							defaultValue={
								user?.middle_name === null || user?.middle_name === "null"
									? ""
									: user?.middle_name || ""
							}
						/>
					</div>

					<div>
						<Label htmlFor="last_name">Last Name</Label>
						<input
							className="w-full p-2 border rounded-md"
							{...register("last_name")}
							defaultValue={
								user?.last_name === null || user?.last_name === "null"
									? ""
									: user?.last_name || ""
							}
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
						<Label required htmlFor="batch">
							Batch
						</Label>
						<Select
							onValueChange={async (value) => {
								const batchId = Number(value);
								setValue("batch_id", batchId);

								try {
									const response = await apiService.get(`/batch/${batchId}`);
									const fetchedSemesters = response.data.payload.semesters || [];
									setSemesters(fetchedSemesters);
								} catch (error) {
									console.error("Error fetching semesters:", error);
									setSemesters([]);
								}
							}}
						>
							<SelectTrigger error={errors?.batch_id?.message}>
								<SelectValue
									placeholder={
										user?.batch ? formatBatchInfo(user.batch) : "Select Batch"
									}
									{...register("batch_id", {
										required: "Batch is required",
									})}
								/>
							</SelectTrigger>

							<SelectContent>
								{batch.map((batch) => (
									<SelectItem key={batch.type} value={batch.id.toString()}>
										{formatBatchInfo(batch)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="grid grid-cols-2 gap-3">
						<div>
							<Label required htmlFor="semester">
								Semester
							</Label>
							<Select
								onValueChange={(value) => {
									setValue("semester_id", Number(value));
								}}
							>
								<SelectTrigger error={errors?.semester_id?.message}>
									<SelectValue
										placeholder={user?.semester.title || "Select Semester"}
										{...register("semester_id", {
											required: "Semester is required",
										})}
									/>
								</SelectTrigger>

								<SelectContent>
									{semesters.length > 0
										? semesters.map((sem) => (
												<SelectItem key={sem.id} value={sem.id.toString()}>
													Semester {sem.title}
												</SelectItem>
										  ))
										: null}
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>

				<div className="mt-4">
					<Label required htmlFor="marks">
						Marks
					</Label>
					<div className="flex flex-wrap gap-3 mt-2">
						{semesters.length > 0 ? (
							semesters.map((sem) => (
								<Button
									key={sem.id}
									type="button"
									variant="outline"
									onClick={() => {
										// Navigate to marks page or perform action
										router.push(`/admin/student/${id}/semester/${sem.id}`);
									}}
								>
									Semester {sem.title}
								</Button>
							))
						) : (
							<p className="text-sm text-gray-500">
								Select a batch to view semesters
							</p>
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
