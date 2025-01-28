import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export default function TableDemo() {
	return (
		<div className="w-full px-4">
			<Table className="w-full ">
				<TableHeader>
					<TableRow>
						<TableHead className="w-[20%]">Registration Number</TableHead>
						<TableHead className="w-[20%]">Name</TableHead>
						<TableHead className="w-[20%]">Fathers name</TableHead>
						<TableHead className="w-[20%]">Semester</TableHead>
						<TableHead className="w-[20%] ">Branch</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow>
						<TableCell className="font-medium">220099510648</TableCell>
						<TableCell>Aditya Pant </TableCell>
						<TableCell>Ramesh Chandra Pant</TableCell>
						<TableCell>6</TableCell>
						<TableCell>Computer Science Engineering</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</div>
	);
}
