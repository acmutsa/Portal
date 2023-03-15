import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/server/db/client";
import { date, z } from "zod";
import { PrettyMemberDataWithoutIdSchema, toMemberData } from "@/utils/transform";
import { isValuesNull, removeEmpty } from "@/utils/helpers";
import { MemberData } from "@prisma/client";
import { PrettyMemberSchema } from "@/server/controllers/member";

/**
 * Handler for requests intending to operate on a unique member ID.
 * @param req
 * @param res
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { query, body, method } = req;

	// Validate that the client is an admin
	const credentialsSchema = z.object({
		admin_username: z.string(),
		admin_password: z.string(),
	});
	const credentials = credentialsSchema.safeParse(req.body);
	if (!credentials.success) {
		return res.status(500).json({ msg: "Invalid request" });
	}
	// await validateAdmin(credentials.data);

	// Validate queried ID
	const idParser = z.object({ id: z.string() });
	const id = idParser.safeParse(query);
	if (!id.success) {
		return res.status(500).json({ msg: "Invalid request" });
	}

	switch (method) {
		case "DELETE":
			return res.status(200).json(
				await prisma.member.delete({
					where: { id: id.data.id },
				})
			);

		case "GET":
			return res.status(200).json(
				await prisma.member.findUnique({
					where: { id: id.data.id },
				})
			);

		case "PUT":
			return res.status(200).json(await updateMember(req, body, id.data.id));

		case "POST":
			const memberSchema = z.object({
				email: z.string().email().trim(),
				name: z.string().trim(),
				joinDate: z.string().or(date()),
				extendedMemberData: z.string().trim(),
			});
			const parsedPostBody = memberSchema.safeParse(req.body);
			if (!parsedPostBody.success) {
				return res.status(500).json({ msg: "Invalid request" });
			}

			return res.status(200).json(
				await prisma.member.create({
					data: {
						id: id.data.id,
						email: parsedPostBody.data.email,
						name: parsedPostBody.data.name,
						joinDate: new Date(Date.now()),
						extendedMemberData: parsedPostBody.data.extendedMemberData,
					},
				})
			);
	}
}

/**
 * A method for determining whether the client specified to create a new
 * record if the record specified to edit did not exist.
 * @param req
 * @param res
 */
function upsert(req: NextApiRequest, res: NextApiResponse): boolean | void {
	const upsertSchema = z.object({ upsert: z.boolean() });
	const upsert = upsertSchema.safeParse(req.body);
	if (!upsert.success) {
		return res.status(500).json({ msg: "Invalid request" });
	}

	return upsert.data.upsert;
}

/**
 * A method for updating the MemberData table associated with a given ID.
 * @param req
 * @param res
 * @param id The ID of the member associated with the MemberData row.
 */
async function updateMember(
	req: NextApiRequest,
	res: NextApiResponse,
	id: string
): Promise<MemberData | null> {
	const prettyMemberData = PrettyMemberDataWithoutIdSchema.safeParse(req.body);
	const prettyMember = PrettyMemberSchema.safeParse(req.body);
	if (isValuesNull(prettyMember))
		throw new RangeError("At least one value in 'data' must be non-empty");

	const nonPrettyMemberData = toMemberData({ id, ...prettyMemberData });
	console.log(nonPrettyMemberData);
	console.log(removeEmpty(nonPrettyMemberData));

	if (upsert(req, res)) {
		return await prisma.memberData.upsert({
			where: { memberID: id },
			create: nonPrettyMemberData,
			// Remove null values before updating to prevent overwriting non-null values
			update: removeEmpty(nonPrettyMemberData),
		});
	} else {
		return await prisma.memberData.update({
			where: { memberID: id as string },
			data: removeEmpty(nonPrettyMemberData),
		});
	}
}
