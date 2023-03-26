import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/server/db/client";
import { IdSchema, updateMemberAndData } from "@/utils/transform";

/**
 * Handler for requests intending to operate on a unique member ID.
 * @param req
 * @param res
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { query, body, method } = req;

	// Validate queried ID
	const id = IdSchema.safeParse(query);
	if (!id.success) {
		return res.status(500).json({ msg: "Invalid request" });
	}

	switch (method) {
		case "GET":
			return res.status(200).json(
				await prisma.member.findUnique({
					where: { id: id.data.id },
				})
			);

		case "PUT":
			return res.status(200).json(await updateMemberAndData(req, body, id.data.id));

		case "DELETE":
			return res.status(200).json(await prisma.member.delete({ where: { id: id.data.id } }));
	}
}
