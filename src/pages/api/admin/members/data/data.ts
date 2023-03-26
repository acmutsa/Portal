import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/server/db/client";
import { isValuesNull, removeEmpty } from "@/utils/helpers";
import {
	createOrNullMember,
	PrettyMemberAndDataExtendedSchema,
	PrettyMemberDataSchema,
} from "@/utils/transform";

/**
 * Handler for requests intending to operate across non-unique member data.
 * @param req
 * @param res
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	switch (req.method) {
		/**
		 * Create new MemberData
		 *
		 */
		case "POST":
			const parsedPostBody = PrettyMemberAndDataExtendedSchema.safeParse(req.body);
			if (!parsedPostBody.success) {
				return res.status(500).json({ msg: "Invalid request" });
			}

			if (!parsedPostBody.success) {
				return res.status(500).json({ msg: "Invalid Request." });
			}

			return res.status(200).json(
				await prisma.memberData.create({
					data: {
						member: createOrNullMember(parsedPostBody.data.id, parsedPostBody),
						major: parsedPostBody.data.major,
						classification: parsedPostBody.data.classification,
						graduationDate: parsedPostBody.data.graduationDate as unknown as string,
						shirtIsUnisex: parsedPostBody.data.shirtIsUnisex,
						shirtSize: parsedPostBody.data.shirtSize,
						isInACM: parsedPostBody.data.organizations?.has("ACM"),
						isInACMW: parsedPostBody.data.organizations?.has("ACM_W"),
						isInRC: parsedPostBody.data.organizations?.has("ROWDY_CREATORS"),
						isInICPC: parsedPostBody.data.organizations?.has("ICPC"),
						isInCIC: parsedPostBody.data.organizations?.has("CODING_IN_COLOR"),
						isBlackorAA: parsedPostBody.data.ethnicity?.has("BLACK_OR_AFRICAN_AMERICAN"),
						isAsian: parsedPostBody.data.ethnicity?.has("ASIAN"),
						isNAorAN: parsedPostBody.data.ethnicity?.has("NATIVE_AMERICAN_ALASKAN_NATIVE"),
						isNHorPI: parsedPostBody.data.ethnicity?.has("NATIVE_HAWAIIAN_PACIFIC_ISLANDER"),
						isHispanicorLatinx: parsedPostBody.data.ethnicity?.has("HISPANIC_OR_LATINO"),
						isWhite: parsedPostBody.data.ethnicity?.has("WHITE"),
						isMale: parsedPostBody.data.identity?.has("MALE"),
						isFemale: parsedPostBody.data.identity?.has("FEMALE"),
						isNonBinary: parsedPostBody.data.identity?.has("NON_BINARY"),
						isTransgender: parsedPostBody.data.identity?.has("TRANSGENDER"),
						isIntersex: parsedPostBody.data.identity?.has("INTERSEX"),
						doesNotIdentify: parsedPostBody.data.identity?.has("DOES_NOT_IDENTIFY"),
						otherIdentity: parsedPostBody.data.identity as unknown as string,
						address: parsedPostBody.data.address,
					},
				})
			);

		/**
		 * Get all MemberData with respect to given 'where' clause, else get all MemberData
		 *
		 */
		case "GET":
			if (!req.body) return res.status(200).json(await prisma.memberData.findMany());

			// Using given 'where' clause, return related MemberData
			const parsedGetBody = PrettyMemberDataSchema.safeParse(req.body);

			removeEmpty(parsedGetBody);
			if (isValuesNull(parsedGetBody))
				throw new RangeError("At least one value in 'data' must be non-empty.");
			if (!parsedGetBody.success) return res.status(500).json({ msg: "Invalid Request." });

			return res.status(200).json(
				await prisma.memberData.findMany({
					where: {
						memberID: parsedGetBody.data.id,
						major: parsedGetBody.data.major,
						classification: parsedGetBody.data.classification,
						graduationDate: parsedGetBody.data.graduationDate as unknown as string,
						shirtIsUnisex: parsedGetBody.data.shirtIsUnisex,
						shirtSize: parsedGetBody.data.shirtSize,
						isInACM: parsedGetBody.data.organizations?.has("ACM"),
						isInACMW: parsedGetBody.data.organizations?.has("ACM_W"),
						isInRC: parsedGetBody.data.organizations?.has("ROWDY_CREATORS"),
						isInICPC: parsedGetBody.data.organizations?.has("ICPC"),
						isInCIC: parsedGetBody.data.organizations?.has("CODING_IN_COLOR"),
						isBlackorAA: parsedGetBody.data.ethnicity?.has("BLACK_OR_AFRICAN_AMERICAN"),
						isAsian: parsedGetBody.data.ethnicity?.has("ASIAN"),
						isNAorAN: parsedGetBody.data.ethnicity?.has("NATIVE_AMERICAN_ALASKAN_NATIVE"),
						isNHorPI: parsedGetBody.data.ethnicity?.has("NATIVE_HAWAIIAN_PACIFIC_ISLANDER"),
						isHispanicorLatinx: parsedGetBody.data.ethnicity?.has("HISPANIC_OR_LATINO"),
						isWhite: parsedGetBody.data.ethnicity?.has("WHITE"),
						isMale: parsedGetBody.data.identity?.has("MALE"),
						isFemale: parsedGetBody.data.identity?.has("FEMALE"),
						isNonBinary: parsedGetBody.data.identity?.has("NON_BINARY"),
						isTransgender: parsedGetBody.data.identity?.has("TRANSGENDER"),
						isIntersex: parsedGetBody.data.identity?.has("INTERSEX"),
						doesNotIdentify: parsedGetBody.data.identity?.has("DOES_NOT_IDENTIFY"),
						otherIdentity: parsedGetBody.data.identity as unknown as string,
						address: parsedGetBody.data.address,
					},
				})
			);
	}
}
