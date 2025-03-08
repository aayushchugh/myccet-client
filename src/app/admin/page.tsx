import { Button } from "@/components/ui";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import Link from "next/link";
import { Shield } from "lucide-react";
import { UserRoundPen } from "lucide-react";
import { GraduationCap } from "lucide-react";

export default function Home() {
	return (
		<div className="grid grid-cols-3 gap-4">
			<section className="min-h-dvh flex items-center justify-center">
				<Card className="max-w-2xl w-full ">
					<CardHeader className="flex items-center justify-center p-0">
						<div className="">
							<Shield size={200} strokeWidth={0.3} color="#737373" />
						</div>
					</CardHeader>
					<CardContent>
						<Typography variant={"h2"} className="text-center">
							Admin
						</Typography>
						<div className="flex items-center justify-evenly mt-6">
							<Link href={"/admin/view"}>
								<Button className="w-[76px]">View</Button>
							</Link>
							<Link href={"/admin/create"}>
								<Button className="w-[76px] ">Create</Button>
							</Link>
						</div>
					</CardContent>
				</Card>
			</section>
			<section className="min-h-dvh flex items-center justify-center">
				<Card className="max-w-2xl w-full">
					<CardHeader className="flex items-center justify-center p-0">
						<div>
							<UserRoundPen size={200} strokeWidth={0.3} color="#737373" />
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
							<GraduationCap size={200} strokeWidth={0.3} color="#737373" />
						</div>
					</CardHeader>
					<CardContent>
						<Typography variant={"h2"} className="text-center">
							Student
						</Typography>
						<div className="flex items-center justify-evenly mt-6">
							<Link href={"/admin/student/view"}>
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
