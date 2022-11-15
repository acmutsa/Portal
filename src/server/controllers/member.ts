import { prisma, Member } from "@/server/db/client";

/**
 * Acquire a member object given their shortID and email.
 * @param shortID
 * @param email
 */
export async function getMemberIndirect(shortID: string, email: string): Promise<Member | null> {
	return await prisma.member.findFirst({
		where: {
			shortID: shortID,
			email: email,
		},
	});
}

/**
 * Acquire a member given their unique identifier.
 * @param id Their unique, full-length identifier. This is *NOT* their shortID. Use getMemberIndirect for that.
 */
export async function getMember(id: string): Promise<Member | null> {
	return await prisma.member.findUnique({
		where: {
			id: id,
		},
	});
}
