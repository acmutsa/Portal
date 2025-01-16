import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../server/db/client";
import { z } from "zod";
import { env } from "@/env/server.mjs";

// This is pretty much a "Made for purpose" version of this for the migration since python does not support prisma.
// TODO: In the future it should be made more secure / predictable / optimized.
// Also should probably make some docs for this at some point on Notion

const getAllUsers = async (req: NextApiRequest, res: NextApiResponse) => {
	const parser = z.object({
		apikey: z.string(),
	});

	const parseRes = parser.safeParse(req.body);

	if (parseRes.success) {
		if (parseRes.data.apikey == env.ADMIN_UNAME + env.ADMIN_PASS) {
			const allMembers = await prisma.member.findMany({
        include: {
			data: true,
			checkins: {
				include: {
					event: true,
				},
			},
		},
      });
      
			return res.status(200).json({ success: true, allMembers, msg: null });
		} else {
			return res.status(401).json({ success: false, member: null, msg: "Invalid API Key" });
		}
	} else {
		return res.status(400).json({ success: false, member: null, msg: "Invalid Request" });
	}

	res.status(200).json({ example: "test" });
};

export default getAllUsers;

export const config = {
  api: {
    responseLimit: false,
  },
}
