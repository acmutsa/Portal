import { IncomingMessage, ServerResponse } from "http";
import { Member } from "@/server/db/client";
import { getMemberIndirect } from "@/server/controllers/member";
import { deleteCookie } from "cookies-next";
import { NextApiRequestCookies } from "next/dist/server/api-utils";

export type NextServerRequest = IncomingMessage & { cookies: NextApiRequestCookies };

export async function validateMember(
	request: NextServerRequest,
	response: ServerResponse
): Promise<[boolean, Member | null]> {
	// Acquire the basic data to look for the member
	const shortID = request.cookies.member_shortID;
	const email = request.cookies.member_email;
	if (shortID == null || email == null) return [false, null];

	// Data available, try and find a matching user.
	const member = await getMemberIndirect(shortID, email);

	// If nothing was found, ask for the cookies to be deleted.
	if (member == null) {
		deleteCookie("member_email", { req: request, res: response });
		deleteCookie("member_shortID", { req: request, res: response });
		return [false, null];
	}

	// Otherwise, it's valid, return the member.
	return [true, member];
}
