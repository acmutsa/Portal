import { IncomingMessage, ServerResponse } from "http";
import { Member } from "@/server/db/client";
import { deleteCookie } from "cookies-next";
import { NextApiRequestCookies } from "next/dist/server/api-utils";
import { getMember } from "@/server/controllers/member";

export type NextServerRequest = IncomingMessage & { cookies: NextApiRequestCookies };

export async function validateMember(
	request: NextServerRequest,
	response: ServerResponse
): Promise<[boolean, Member | null]> {
	// Acquire the basic data to look for the member
	const id = request.cookies.member_id;
	const email = request.cookies.member_email;
	if (id == null || email == null) return [false, null];

	// Data available, try and find a matching user.
	const member = await getMember(id);

	// If nothing was found, ask for the cookies to be deleted.
	if (member == null) {
		deleteCookie("member_email", { req: request, res: response });
		deleteCookie("member_id", { req: request, res: response });
		return [false, null];
	}

	// Otherwise, it's valid, return the member.
	return [true, member];
}
