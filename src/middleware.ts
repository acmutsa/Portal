import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { env } from "@/env/server.mjs";

export function middleware(req: NextRequest) {
	if (req.nextUrl.pathname.startsWith("/admin")) {
		let username = req.cookies.get("admin_uname");
		let password = req.cookies.get("admin_pass");
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
	matcher: ["/admin/:path*", "/admin"],
};
