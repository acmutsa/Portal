import { prisma, Member } from "@/server/db/client";

/**
 * Acquire a member given their unique identifier.
 * @param id
 */
export async function getMember(id: string): Promise<Member | null> {
	return await prisma.member.findUnique({
		where: {
			id: id,
		},
	});
}

/**
 * Return all Members in the database.
 * @param extended If true, eager-load the extended member data. Defaults to false.
 */
export async function getAllMembers(extended: boolean = false): Promise<Member[]> {
	return await prisma.member.findMany({
		include: {
			data: extended,
		},
	});
}
