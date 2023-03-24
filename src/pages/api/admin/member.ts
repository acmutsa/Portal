import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/server/db/client";
import { isValuesNull, removeEmpty } from "@/utils/helpers";
import {
	getWhereInput,
	RequestSchemaWithFilter,
	RestCredentialsSchema,
	StrictPrettyMemberSchema,
} from "@/utils/transform";
import { validateAdmin } from "@/server/router/admin";

/**
 * Handler for requests intending to operate across non-unique base member information.
 * @param req
 * @param res
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const credentials = RestCredentialsSchema.safeParse(req.body);

	if (!credentials.success) {
		return res.status(500).json({ msg: "Invalid request" });
	}
	await validateAdmin(credentials.data);

	switch (req.method) {
		/**
		 * Get all members with respect to given 'where' clause
		 *
		 * TODO: Enable operations such as 'field_value_a && other_field_b' and 'field_value_a && other_field_b'
		 */
		case "GET":
			const parsedGetBody = RequestSchemaWithFilter.safeParse(req.body);

			removeEmpty(parsedGetBody);
			if (isValuesNull(parsedGetBody))
				throw new RangeError("At least one value in 'data' must be non-empty.");
			if (!parsedGetBody.success) return res.status(500).json({ msg: "Invalid Request" });

			// Check if filters were given
			const gotWhereInput = getWhereInput(
				parsedGetBody.data.filter,
				parsedGetBody.data.filterValue
			);

			if (gotWhereInput) {
				return res.status(200).json(
					await prisma.member.findMany({
						where: gotWhereInput,
						include: {
							data: true,
						},
					})
				);
			}
			return res.status(200).json(
				await prisma.member.findMany({
					include: {
						data: true,
					},
				})
			);

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

		/**
		 * Edit existing members based on ID, name, email, or join date
		 *
		 */
		case "PUT":
			const parsedPutBody = RequestSchemaWithFilter.safeParse(req.body);

			if (isValuesNull(parsedPutBody))
				throw new RangeError("At least one value in 'data' must be non-empty.");
			removeEmpty(parsedPutBody);

			if (!parsedPutBody.success) return res.status(500).json({ msg: "Invalid Request" });
			if (typeof parsedPutBody.data.filterValue !== "string")
				return res.status(422).json({ msg: "'filterValue' must be a string" });

			// Based on specified 'where' clause, update corresponding member(s)
			const whereInput = getWhereInput(parsedPutBody.data.filter, parsedPutBody.data.filterValue);
			if (!whereInput)
				return res.status(422).json({ msg: "Invalid 'filterValue' or 'filterValueType'" });

			return res.status(200).json(
				await prisma.member.updateMany({
					where: whereInput,
					data: {
						id: parsedPutBody.data.id,
						name: parsedPutBody.data.name,
						email: parsedPutBody.data.email,
						extendedMemberData: parsedPutBody.data.extendedMemberData,
					},
				})
			);

		case "DELETE":
			/**
			 * Delete many records that contain a particular given value.
			 *
			 */
			const parsedDeleteBody = RequestSchemaWithFilter.safeParse(req.body);

			if (isValuesNull(parsedDeleteBody))
				throw new RangeError("At least one value in 'data' must be non-empty.");
			removeEmpty(parsedDeleteBody);

			if (!parsedDeleteBody.success) return res.status(500).json({ msg: "Invalid Request" });
			if (typeof parsedDeleteBody.data.filterValue !== "string")
				return res.status(422).json({ msg: "'filterValue' must be a string" });

			// Based on specified 'where' clause, update corresponding member(s)
			const deleteWhereInput = getWhereInput(
				parsedDeleteBody.data.filter,
				parsedDeleteBody.data.filterValue
			);
			if (!deleteWhereInput)
				return res.status(422).json({ msg: "Invalid 'filterValue' or 'filterValueType'" });

			return res.status(200).json(
				await prisma.member.deleteMany({
					where: deleteWhereInput,
				})
			);
	}
}
