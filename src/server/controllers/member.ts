import { Member, prisma } from "@/server/db/client";
import { MemberData } from "@prisma/client";
import { PrettyMemberDataWithoutId, toMemberData } from "@/utils/transform";
import { z } from "zod";
import { isValuesNull, removeEmpty } from "@/utils/helpers";

/**
 * A explicit type containing a nullable `data` property. Used for the Member.MemberData relation.
 */
export type MemberWithData = Member & { data: MemberData | null };

/**
 * A zod schema containing the updatable properties in the Member table.
 * @const
 */
export const PrettyMemberSchema = z
	.object({
		name: z.string(),
		email: z.string(),
		extendedMemberData: z.string(),
	})
	.partial();
export type PrettyMember = z.infer<typeof PrettyMemberSchema>;

/**
 * Acquire a member given their unique identifier.
 * @param id The member's myUTSA identifier
 * @param extendedData If true, include the extended member data.
 */
export async function getMember(
	id: string,
	extendedData: boolean = false
): Promise<MemberWithData | null> {
	const member = await prisma.member.findUnique({
		where: {
			id: id,
		},
		include: extendedData
			? {
					data: true,
			  }
			: undefined,
	});

	if (member == null) return null;

	return {
		data: null,
		...member,
	};
}

/**
 * Acquire a given member's MemberData row. Nullable return.
 * @param id The id of the member associated with the MemberData item.
 */
export async function getMemberData(id: string): Promise<MemberData | null> {
	return await prisma.memberData.findUnique({
		where: {
			memberID: id,
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

/**
 * A method for updating a member's direct attributes. Use {@link updateMemberData} for updating the
 * extended member data table. If the member does not exist, nothing will happen.
 * @param id
 * @param data A set of fully optional properties you can update.
 * @return {Member|null} This method will return null if the Member could not be updated. Otherwise,
 * the full Member will be returned.
 */
export async function updateMember(id: string, data: PrettyMember): Promise<Member | null> {
	if (isValuesNull(data)) throw new RangeError("At least one value in 'data' must be non-empty.");
	const member = getMember(id);
	if (member == null) return null;

	// Update and then return the member.
	return await prisma.member.update({
		where: {
			id: id,
		},
		data,
	});
}

/**
 * A method for updating the MemberData table associated with a given Member.
 *
 * @param id The ID of the member associated with the MemberData row.
 * @param data The data to populate the table with.
 * @param upsert {boolean} If true, this function will automatically create a MemberData row if it
 * does not exist for the specified Member. Any unspecified values will be populated with null.
 */
export async function updateMemberData(
	id: string,
	data: PrettyMemberDataWithoutId,
	upsert: boolean = false
): Promise<MemberData | null> {
	if (isValuesNull(data)) throw new RangeError("At least one value in 'data' must be non-empty.");

	// Convert it to non-pretty member data for the query
	const memberData = toMemberData({ id, ...data });

	if (upsert)
		return await prisma.memberData.upsert({
			where: { memberID: id },
			create: memberData,
			// We do not want to override values with null, remove any non-empty values.
			update: removeEmpty(memberData),
		});
	else
		return await prisma.memberData.update({
			where: { memberID: id },
			data: memberData,
		});
}
