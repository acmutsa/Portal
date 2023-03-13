import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/server/db/client";
import { z } from "zod";
import { isValuesNull, removeEmpty } from "@/utils/helpers";
import {FilterType, FilterValueType, getWhereInput, StrictPrettyMemberSchema} from "@/utils/transform";
import {validateAdmin} from "@/server/router/admin";

/**
 * Handler for non member-indexing endpoints.
 * @param req
 * @param res
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const credentialsSchema = z.object({
		admin_username: z.string(),
		admin_password: z.string(),
	});
	const credentials = credentialsSchema.safeParse(req.body);

	if (!credentials.success) {
		return res.status(500).json({ msg: "Invalid request" });
	}
	await validateAdmin(credentials.data);

	switch (req.method) {
		// Get all members
		case "GET":
			const allMembers = await prisma.member.findMany({
				include: {
					data: true,
				},
			});
			res.status(200).json(allMembers);
			break;

		// Add a new member
		case "POST":
			const parsedPostBody = StrictPrettyMemberSchema.required().safeParse(req.body);

			if (!parsedPostBody.success) return res.status(500).json({ msg: "Invalid Request" });
			if (isValuesNull(parsedPostBody.data))
				throw new RangeError("At least one value in 'data' must be non-empty");

			return res.status(200).json(
				await prisma.member.create({
					data: {
						id: parsedPostBody.data.id,
						email: parsedPostBody.data.email,
						name: parsedPostBody.data.name,
						extendedMemberData: parsedPostBody.data.extendedMemberData,
						joinDate: new Date(Date.now()),
					},
				})
			);

		// Edit existing member(s) based on ID, name, email, or join date
		case "PUT":
			const putSchema = z.object({
				id: z.string().trim().optional(),
				name: z.string().trim().optional(),
				email: z.string().email().trim().optional(),
				extendedMemberData: z.string().trim().optional(),
				filter: FilterType,
				filterValue: FilterValueType,
			});
			const parsedPutBody = putSchema.safeParse(req.body);

			if (isValuesNull(parsedPutBody))
				throw new RangeError("At least one value in 'data' must be non-empty.");
			removeEmpty(parsedPutBody);

			if (!parsedPutBody.success) return res.status(500).json({ msg: "Invalid Request" });
			if (isValuesNull(parsedPutBody.data))
				throw new RangeError("At least one value in 'data' must be non-empty.");
			if (typeof parsedPutBody.data.filterValue !== "string")
				return res.status(422).json({ msg: "'filterValue' must be a string" });

			// Based on specified 'where' clause, update corresponding member(s)
			const whereInput = getWhereInput(parsedPutBody.data.filter, parsedPutBody.data.filterValue);
			if (!whereInput)
				return res.status(422).json({ msg: "Invalid 'filterValue' or 'filterValueType'" });

			return res.status(200).json(
				await prisma.member.updateMany({
					where: getWhereInput(parsedPutBody.data.filter, parsedPutBody.data.filterValue),
					data: {
						id: parsedPutBody.data.id,
						name: parsedPutBody.data.name,
						email: parsedPutBody.data.email,
						extendedMemberData: parsedPutBody.data.extendedMemberData,
					},
				})
			);
	}
}
