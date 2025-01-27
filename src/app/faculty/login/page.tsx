import * as React from "react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
	return (
		<section className="min-h-dvh flex flex-col justify-center items-center ">
			<Card className="w-1/3 ">
				<CardHeader className="w-[300px] flex justify-center">
					<img src="/logo.svg" alt="" className="" />
				</CardHeader>
				<CardContent>
					<form>
						<div className="grid w-full items-center gap-4">
							<div className="flex flex-col space-y-1.5">
								<Label htmlFor="name">Email</Label>
								<Input id="name" placeholder="email address" />
							</div>
							<div className="flex flex-col space-y-1.5">
								<Label htmlFor="framework">Password</Label>
								<Input id="name" placeholder="password" />
							</div>
						</div>
					</form>
				</CardContent>
				<CardFooter className="flex justify-center">
					<Button>Login</Button>
				</CardFooter>
			</Card>
		</section>
	);
}
