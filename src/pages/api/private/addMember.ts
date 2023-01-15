import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../server/db/client";
import { z } from "zod";
import { env } from "@/env/server.mjs";

// This is pretty much a "Made for purpose" version of this for the migration since python does not support prisma.
// TODO: In the future it should be made more secure / predicatable / optimized.
// Also should probably make some docs for this at some point on Notion

const addMember = async (req: NextApiRequest, res: NextApiResponse) => {
	const parser = z.object({
		apikey: z.string(),
		name: z.string(),
		email: z.string(),
		abc123: z.string(),
		orgs: z.array(z.string()),
		ethnicities: z.array(z.string()),
		genders: z.array(z.string()),
		address: z.string(),
		major: z.string(),
		joinDate: z.string(),
		gradDate: z.string(),
		shirtType: z.string(),
		shirtSize: z.string().max(4),
		birthday: z.string(),
		classification: z.string(),
	});

	const parseRes = parser.safeParse(req.body);

	if (parseRes.success) {
		if (parseRes.data.apikey == env.ADMIN_UNAME + env.ADMIN_PASS) {
			const member = await prisma.member.create({
				data: {
					name: parseRes.data.name,
					email: parseRes.data.email,
					id: parseRes.data.abc123,
					joinDate: new Date(Date.now()),
					extendedMemberData: "",
					data: {
						create: {
							isInACM: parseRes.data.orgs.includes("ACM"),
							isInACMW: parseRes.data.orgs.includes("ACM-W"),
							isInRC:
								parseRes.data.orgs.includes("Rowdy Creators") || parseRes.data.orgs.includes("RC"),
							isInICPC: parseRes.data.orgs.includes("ICPC"),
							isInCIC: parseRes.data.orgs.includes("CIC"),
							isAsian: parseRes.data.ethnicities.includes("Asian"),
							isBlackorAA: parseRes.data.ethnicities.includes("African American or Black"),
							isHispanicorLatinx: parseRes.data.ethnicities.includes("Hispanic / Latinx"),
							isNAorAN: parseRes.data.ethnicities.includes("Native American/Alaskan Native"),
							isNHorPI: parseRes.data.ethnicities.includes("Native Hawaiian or Pacific Islander"),
							isWhite: parseRes.data.ethnicities.includes("White"),
							isMale: parseRes.data.genders.includes("Male"),
							isFemale: parseRes.data.genders.includes("Female"),
							isNonBinary: parseRes.data.genders.includes("Non-Binary"),
							isTransgender: parseRes.data.genders.includes("Transgender"),
							isIntersex: parseRes.data.genders.includes("Intersex"),
							doesNotIdentify: parseRes.data.genders.includes("I prefer not to say"),
							address: parseRes.data.address,
							major: parseRes.data.major,
							graduationDate: parseRes.data.gradDate,
							shirtIsUnisex: parseRes.data.shirtType == "Unisex",
							shirtSize: parseRes.data.shirtSize,
							Birthday: parseRes.data.birthday,
							classification: parseRes.data.classification,
						},
					},
				},
			});
			return res.status(200).json({ success: true, member, msg: null });
		} else {
			return res.status(401).json({ success: false, member: null, msg: "Invalid API Key" });
		}
	} else {
		return res.status(400).json({ success: false, member: null, msg: "Invalid Request" });
	}

	res.status(200).json({ example: "test" });
};

export default addMember;
