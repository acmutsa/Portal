import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/server/db/client";
import {
	IdSchema,
	RestCredentialsSchema,
	StrictPrettyMemberSchema,
	updateMemberAndData,
} from "@/utils/transform";
import { isValuesNull } from "@/utils/helpers";
import { validateAdminRest } from "@/utils/rest";

/**
 * Handler for requests intending to operate on a unique member ID.
 * @param req
 * @param res
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { query, body, method } = req;

	// Validate that the client is an admin
	const credentials = RestCredentialsSchema.safeParse(req.body);
	if (!credentials.success) {
		return res.status(500).json({ msg: "Invalid request" });
	}
	await validateAdminRest(credentials.data, res);

	// Validate queried ID
	const id = IdSchema.safeParse(query);
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
			return res.status(200).json(await updateMemberAndData(req, body, id.data.id));

		case "POST":
			const parsedPostBody = StrictPrettyMemberSchema.required().safeParse(req.body);

			if (!parsedPostBody.success) return res.status(500).json({ msg: "Invalid Request" });
			if (isValuesNull(parsedPostBody.data))
				throw new RangeError("At least one value in 'data' must be non-empty");

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
