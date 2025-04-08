"use client";
import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Subject {
	code: string;
	title: string;
	internalMarks: number;
	externalMarks: number;
	status: string;
}

export default function SubjectMarksForm() {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<{ subjects: Subject[] }>();

	const onSubmit: SubmitHandler<{ subjects: Subject[] }> = async (data) => {
		try {
			console.log("Submitting Data:", data.subjects);
			// API call to save subjects data
			// await apiService.post("/subjects", data.subjects);

			toast.success("Subjects Saved Successfully!");
			router.push("/admin/subject");
		} catch (error) {
			console.error("❌ API Error:", error);
			toast.error("Failed to save subjects. Try again.");
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center">
			<table className="border-collapse border border-black w-full max-w-4xl mt-5">
				<thead>
					<tr className="">
						<th className="border border-black px-4 py-2">Subject Code</th>
						<th className="border border-black px-4 py-2">Subject Name</th>
						<th className="border border-black px-4 py-2">Internal Marks</th>
						<th className="border border-black px-4 py-2">External Marks</th>
						<th className="border border-black px-4 py-2">Status (P/F)</th>
					</tr>
				</thead>
				<tbody>
					{[0, 1, 2].map((index) => (
						<tr key={index}>
							<td className="border border-black px-4 py-2">
								<Input
									type="text"
									placeholder="Code"
									{...register(`subjects.${index}.code`, {
										required: "Required",
									})}
								/>
								{errors.subjects?.[index]?.code && (
									<p className="text-red-500 text-xs">
										{errors.subjects[index].code?.message}
									</p>
								)}
							</td>
							<td className="border border-black px-4 py-2">
								<Input
									type="text"
									placeholder="Name"
									{...register(`subjects.${index}.title`, {
										required: "Required",
									})}
								/>
								{errors.subjects?.[index]?.title && (
									<p className="text-red-500 text-xs">
										{errors.subjects[index].title?.message}
									</p>
								)}
							</td>
							<td className="border border-black px-4 py-2">
								<Input
									type="number"
									placeholder="Internal"
									{...register(`subjects.${index}.internalMarks`, {
										required: "Required",
										valueAsNumber: true,
									})}
								/>
								{errors.subjects?.[index]?.internalMarks && (
									<p className="text-red-500 text-xs">
										{errors.subjects[index].internalMarks?.message}
									</p>
								)}
							</td>
							<td className="border border-black px-4 py-2">
								<Input
									type="number"
									placeholder="External"
									{...register(`subjects.${index}.externalMarks`, {
										required: "Required",
										valueAsNumber: true,
									})}
								/>
								{errors.subjects?.[index]?.externalMarks && (
									<p className="text-red-500 text-xs">
										{errors.subjects[index].externalMarks?.message}
									</p>
								)}
							</td>
							<td className="border border-black px-4 py-2">
								<Input
									type="string"
									placeholder="status"
									{...register(`subjects.${index}.status`, {
										required: "Required",
										valueAsNumber: true,
									})}
								/>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<Button type="submit" disabled={isSubmitting} className="mt-4">
				{isSubmitting ? "Submitting..." : " create marksheet"}
			</Button>
		</form>
	);
}
