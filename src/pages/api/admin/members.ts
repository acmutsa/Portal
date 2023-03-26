import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/server/db/client";
import { isValuesNull, removeEmpty } from "@/utils/helpers";
import {
	getWhereInput,
	isUniqueWhereInput,
	RequestWithFilterSchema,
	StrictPrettyMemberSchema,
} from "@/utils/transform";

/**
 * Handler for requests intending to operate across non-unique base member information.
 * @param req
 * @param res
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	switch (req.method) {
		/**
		 * Get all members with respect to given 'where' clause, else get all members
		 *
		 * TODO: Enable operations such as 'field_value_a && other_field_b' and 'field_value_a && other_field_b'
		 */
		case "GET":
			// Get all members
			if (!req.body) {
				return res.status(200).json(
					await prisma.member.findMany({
						include: {
							data: true,
						},
					})
				);
			}

			// Using given 'where' clause, return related members
			const parsedGetBody = RequestWithFilterSchema.safeParse(req.body);

			if (isValuesNull(parsedGetBody))
				throw new RangeError("At least one value in 'data' must be non-empty.");
			if (!parsedGetBody.success) return res.status(500).json({ msg: "Invalid Request." });
			removeEmpty(parsedGetBody);

			// Query based on field given and its uniqueness
			const gotWhereInput = getWhereInput(
				parsedGetBody.data.filter,
				parsedGetBody.data.filterValue
			);
			const unique = isUniqueWhereInput(gotWhereInput);

			if (unique) {
				return res.status(200).json(
					await prisma.member.findUnique({
						where: gotWhereInput,
						include: {
							data: true,
						},
					})
				);
			}

			if (!unique && gotWhereInput) {
				return res.status(200).json(
					await prisma.member.findMany({
						where: gotWhereInput,
						include: {
							data: true,
						},
					})
				);
			}

			return res.status(500).json({ msg: "Invalid request." });

		/**
		 * Create a member
		 *
		 */
		case "POST":
			const parsedPostBody = StrictPrettyMemberSchema.required().safeParse(req.body);

			if (!parsedPostBody.success) return res.status(500).json({ msg: "Invalid Request." });
			if (isValuesNull(parsedPostBody.data))
				throw new RangeError("At least one value in 'data' must be non-empty.");

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
	}
}
