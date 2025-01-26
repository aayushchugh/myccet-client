import { Input } from "@/components/ui";
import { Button } from "@/components/ui";
import Image from "next/image";

export default function LoginPage() {
	return (
		<div>
			<div className="flex flex-col items-center drop-shadow-lg translate-y-1/2 bg-slate-400">
				<Image
					src="/logo.png"
					width={200}
					height={200}
					alt="Picture of the author"
				/>
				<Input type="email" placeholder="Email" className="w-[300px] mb-2" />
				<Input
					type="password"
					placeholder="password"
					className="w-[300px] mb-2"
				/>
				<Button>Login</Button>
			</div>
		</div>
	);
}
