import React from "react";
import Image from "next/image";

export default function Logo() {
	return (
		<div className="w-60 h-60 relative">
			<Image src="/logo.svg" alt="logo" fill />
		</div>
	);
}
