import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/server/db/client";
import { IdSchema, PrettyMemberDataWithoutIdSchema, toMemberData } from "@/utils/transform";
import { isValuesNull } from "@/utils/helpers";

/**
 * Handler for requests intending to operate on MemberData, given a unique member ID.
 * @param req
 * @param res
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { query, method } = req;

	const id = IdSchema.safeParse(query);
	if (!id.success) {
		return res.status(500).json({ msg: "Invalid request" });
	}

	switch (method) {
		case "DELETE":
			return res.status(200).json(
				await prisma.memberData.delete({
					where: { memberID: id.data.id },
				})
			);

		case "GET":
			return res.status(200).json(
				await prisma.memberData.findUnique({
					where: { memberID: id.data.id },
				})
			);

		/**
		 * Update MemberData for a particular user
		 */
		case "PUT":
			const prettyMemberData = PrettyMemberDataWithoutIdSchema.safeParse(req.body);
			if (!prettyMemberData.success) {
				return res.status(500).json({ msg: "Invalid request" });
			}
			if (isValuesNull(prettyMemberData)) {
				throw new RangeError("At least one value in 'data' must be non-empty");
			}

			return await prisma.memberData.update({
				where: { memberID: id.data.id },
				data: toMemberData({ id: id.data.id, ...prettyMemberData.data }),
			});
	}
}
