import Image from "next/image";
import { Button } from "../components/ui";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Typography } from "../components/ui/typography";

export default function Home() {
	return (
		<section className="min-h-dvh flex items-center justify-center">
			<Card className="max-w-2xl w-full">
				<CardHeader className="flex items-center justify-center p-0">
					<div className="w-60 h-60 relative">
						<Image src="/logo.svg" alt="logo" fill />
					</div>
				</CardHeader>
				<CardContent>
					<Typography variant={"h2"} className="text-center">
						Please select your role
					</Typography>
					<div className="flex items-center justify-evenly mt-6">
						<Button>Faculty</Button>
						<Button>Admin</Button>
					</div>
				</CardContent>
			</Card>
		</section>
	);
}
