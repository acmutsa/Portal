import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { env } from "@/env/server.mjs";
import { cookies } from "@/utils/constants";

export function middleware(req: NextRequest) {
	const requestPath = req.nextUrl.pathname;

	if (requestPath.startsWith("/admin") && !requestPath.endsWith("/login")) {
		let username = req.cookies.get(cookies.admin_username)?.value;
		let password = req.cookies.get(cookies.admin_password)?.value;
		if (password != env.ADMIN_PASS || username != env.ADMIN_UNAME) {
			if (password == undefined && username == undefined) {
				return NextResponse.redirect(new URL(`/admin/login?next=${requestPath}`, req.url));
			} else {
				return NextResponse.redirect(new URL(`/admin/login?invalid&next=${requestPath}`, req.url));
			}
		}
	}

	if (requestPath.startsWith("/api")) {
		let username = req.headers.get("admin_username");
		let password = req.headers.get("admin_password");
		if (password != env.ADMIN_PASS || username != env.ADMIN_UNAME) {
			return NextResponse.json({ message: "Incorrect or missing credentials." }, { status: 401 });
		}
	}
}

export const config = {
	matcher: ["/admin/:path*", "/admin", "/checkin/:path*", "/check-in/:path*", "/api/admin/:path*"],
};
