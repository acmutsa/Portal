import { prisma, Member } from "@/server/db/client";

/**
 * Acquire a member given their unique identifier.
 * @param id
 * @param extendedData If true, include the extended member data.
 */
export async function getMember(id: string, extendedData: boolean = false) {
	return await prisma.member.findUnique({
		where: {
			id: id,
		},
		include: extendedData
			? {
					data: true,
			  }
			: undefined,
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
