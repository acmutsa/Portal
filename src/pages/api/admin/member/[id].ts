import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/server/db/client";
import { date, z } from "zod";
import { updateMemberAndData } from "@/utils/transform";
import {validateAdmin} from "@/server/router/admin";

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
	await validateAdmin(credentials.data);

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
			return res.status(200).json(await updateMemberAndData(req, body, id.data.id));

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
