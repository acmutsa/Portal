import { IncomingMessage, ServerResponse } from "http";
import { Member } from "@/server/db/client";
import { deleteCookie } from "cookies-next";
import { NextApiRequestCookies } from "next/dist/server/api-utils";
import { getMember } from "@/server/controllers/member";
import { MemberData } from "@prisma/client";
import { cookies } from "@/utils/constants";

export type NextServerRequest = IncomingMessage & { cookies: NextApiRequestCookies };

/**
 * A utility function for middleware & SSR/SSG functions. Acquires cookies and attempts to
 * authenticate the request. If authorization matches, the member will be returned.
 * @param request
 * @param response
 * @param extended Acquire the extended member data when acquiring the member's data.
 */
export async function validateMember(
	request: NextServerRequest,
	response: ServerResponse,
	extended: boolean = false
): Promise<[boolean, Member | (Member & { data: MemberData }) | null]> {
	// Acquire the basic data to look for the member
	const id = request.cookies[cookies.member_id]?.toLowerCase();
	const email = request.cookies[cookies.member_email]?.toLowerCase();
	if (id == null || email == null) return [false, null];

	// Data available, try and find a matching user.
	const member = await getMember(id, extended);

	// If nothing was found, ask for the cookies to be deleted.
	if (member == null || member.email != email) {
		deleteCookie(cookies.member_email, { req: request, res: response });
		deleteCookie(cookies.member_id, { req: request, res: response });
		return [false, null];
	}

	// Otherwise, it's valid, return the member.
	return [true, member];
}
