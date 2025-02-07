import { Button } from "@/components/ui";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import Link from "next/link";
import { MdAdminPanelSettings } from "react-icons/md";
import { FaChalkboardTeacher } from "react-icons/fa";
import { PiStudentBold } from "react-icons/pi";

export default function Home() {
	return (
		<div className="grid grid-cols-3 gap-4">
			<section className="min-h-dvh flex items-center justify-center">
				<Card className="max-w-2xl w-full ">
					<CardHeader className="flex items-center justify-center p-0">
						<div className="">
							<MdAdminPanelSettings size={200} color="#B92727" />
						</div>
					</CardHeader>
					<CardContent>
						<Typography variant={"h2"} className="text-center">
							Admin
						</Typography>
						<div className="flex items-center justify-evenly mt-6">
							<Link href={"/admin/manager/create"}>
								<Button className="w-[76px] ">Create</Button>
							</Link>

							<Link href={"/admin/manager/view"}>
								<Button className="w-[76px]">View</Button>
							</Link>
						</div>
					</CardContent>
				</Card>
			</section>
			<section className="min-h-dvh flex items-center justify-center">
				<Card className="max-w-2xl w-full">
					<CardHeader className="flex items-center justify-center p-0">
						<div>
							<FaChalkboardTeacher size={200} color="#d8ab2f" />
						</div>
					</CardHeader>
					<CardContent>
						<Typography variant={"h2"} className="text-center">
							Faculty
						</Typography>
						<div className="flex items-center justify-evenly mt-6">
							<Link href={"/admin/faculty/view"}>
								<Button className="w-[76px]">View</Button>
							</Link>

							<Link href={"/admin/faculty/create"}>
								<Button className="w-[76px]">Create</Button>
							</Link>
						</div>
					</CardContent>
				</Card>
			</section>
			<section className="min-h-dvh flex items-center justify-center">
				<Card className="max-w-2xl w-full">
					<CardHeader className="flex items-center justify-center p-0">
						<div>
							<PiStudentBold size={200} color="#b92727" />
						</div>
					</CardHeader>
					<CardContent>
						<Typography variant={"h2"} className="text-center">
							Student
						</Typography>
						<div className="flex items-center justify-evenly mt-6">
							<Link href={"/admin/student/view/table"}>
								<Button className="w-[76px]">View</Button>
							</Link>

							<Link href={"/admin/student/create"}>
								<Button className="w-[76px]">Create</Button>
							</Link>
						</div>
					</CardContent>
				</Card>
			</section>
		</div>
	);
}
