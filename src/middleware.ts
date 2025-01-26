// middleware.js
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
	const url = request.nextUrl.clone();
	const hostname = request.headers.get("host") || "";
	const hostnameParts = hostname.split(".");
	let subdomain = null;

	if (hostnameParts.length > 2) {
		subdomain = hostnameParts[0];
	}

	if (subdomain === "admin") {
		// Redirect admin subdomain to /admin dashboard
		url.pathname = `/admin${url.pathname}`;
		return NextResponse.rewrite(url);
	}

	if (subdomain === "faculty") {
		// Redirect faculty subdomain to /faculty section
		url.pathname = `/faculty${url.pathname}`;
		return NextResponse.rewrite(url);
	}

	// Default behavior
	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
