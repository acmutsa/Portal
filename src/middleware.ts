import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { env } from "@/env/server.mjs";
import { cookies } from "@/utils/constants";

export function middleware(req: NextRequest) {
	if (req.nextUrl.pathname.startsWith("/admin")) {
		let username = req.cookies.get(cookies.admin_username)?.value;
		let password = req.cookies.get(cookies.admin_password)?.value;
		if (password != env.ADMIN_PASS || username != env.ADMIN_UNAME) {
			if (password == undefined && username == undefined) {
				return NextResponse.rewrite(new URL("/admin/login", req.url));
			} else {
				return NextResponse.rewrite(new URL("/admin/login?invalid", req.url));
			}
		}
	}
}

export const config = {
	matcher: ["/admin/:path*", "/admin", "/checkin/:path*", "/check-in/:path*"],
};
