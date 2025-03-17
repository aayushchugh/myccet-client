"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import apiService from "@/services/api-service";
import { Button } from "@/components/ui";
import { Pencil, Check, X } from "lucide-react";
import { toast } from "sonner"; // Import Sonner

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
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [editingField, setEditingField] = useState<string | null>(null);
	const [editValue, setEditValue] = useState<string>("");

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await apiService.get(`/auth/me`);

				if (response.data && response.data.payload) {
					setUser(response.data.payload);
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
	}, []);

	const handleEdit = (field: keyof User, value: string) => {
		setEditingField(field);
		setEditValue(value);
	};

	const handleUpdate = async () => {
		if (!user || !editingField) return;
		try {
			const updatedUser = { ...user, [editingField]: editValue };
			await apiService.put(`/admin/${user.id}`, updatedUser);
			setUser(updatedUser);
			setEditingField(null);
			window.dispatchEvent(new Event("userUpdated"));

			toast.success(`${editingField.replace("_", " ")} updated successfully`); // Success toast
		} catch (error) {
			console.error("Error updating user:", error);
			toast.error("Failed to update user data."); // Error toast
		}
	};

	const handleCancelEdit = () => {
		setEditingField(null);
		setEditValue("");
		toast.info("Edit cancelled"); // Info toast on cancel
	};

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!editingField) return;
			if (e.key === "Enter") handleUpdate();
			if (e.key === "Escape") handleCancelEdit();
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [editingField, editValue]);

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div className="text-red-500">{error}</div>;

	return (
		<div className="">
			<div className="space-y-4">
				{["email", "first_name", "middle_name", "last_name", "phone", "designation"].map(
					(field) =>
						user && (field !== "middle_name" || user.middle_name) ? (
							<div key={field}>
								<label className="block font-medium capitalize">
									{field.replace("_", " ")}
								</label>
								<div className="relative">
									{editingField === field ? (
										<input
											className="w-full p-2 border rounded-md pr-8"
											value={editValue}
											onChange={(e) => setEditValue(e.target.value)}
											autoFocus
										/>
									) : (
										<input
											className="w-full p-2 border rounded-md pr-8"
											value={user[field as keyof User] as string}
											readOnly
										/>
									)}
									{editingField === field ? (
										<div className="absolute inset-y-0 right-2 flex items-center gap-2">
											<Check
												size={16}
												className="cursor-pointer text-green-600"
												onClick={handleUpdate}
											/>
											<X
												size={16}
												className="cursor-pointer text-red-600"
												onClick={handleCancelEdit}
											/>
										</div>
									) : (
										<Pencil
											size={16}
											className="absolute inset-y-3 right-2 flex items-center cursor-pointer"
											onClick={() =>
												handleEdit(
													field as keyof User,
													user[field as keyof User] as string,
												)
											}
										/>
									)}
								</div>
							</div>
						) : null,
				)}
			</div>
			<Button className="mt-4" onClick={() => router.back()}>
				Go Back
			</Button>
		</div>
	);
}
