import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/server/db/client";
import { z } from "zod";
import {
	IdSchema,
	IdType,
	MemberDataCreateNestedType,
	PrettyMemberDataWithoutIdExtended,
	PrettyMemberDataWithoutIdSchema,
	PrettyMemberDataWithoutIdSchemaExtended,
	StrictPrettyMemberAndDataWithoutIdExtended,
	StrictPrettyMemberAndDataWithoutIdSchemaExtended,
	updateMemberAndData,
	XOR,
} from "@/utils/transform";
import { Prisma } from "@prisma/client";
import { isValuesNull } from "@/utils/helpers";

/**
 * Handler for requests intending to operate on MemberData, given a unique member ID.
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

		case "PUT":
			const prettyMemberData = PrettyMemberDataWithoutIdSchema.safeParse(req.body);
			if (!prettyMemberData.success) {
				return res.status(500).json({ msg: "Invalid request" });
			}
			if (isValuesNull(prettyMemberData)) {
				throw new RangeError("At least one value in 'data' must be non-empty");
			}
			return res.status(200).json(await updateMemberAndData(req, body, id.data.id));

		case "POST":
			let postBody;
			const parsedPostBody = PrettyMemberDataWithoutIdSchemaExtended.safeParse(req.body);
			const parsedPostBodyWithMember = StrictPrettyMemberAndDataWithoutIdSchemaExtended.safeParse(
				req.body
			);
			if (!parsedPostBody.success && !parsedPostBodyWithMember.success) {
				return res.status(500).json({ msg: "Invalid request" });
			}

			if (parsedPostBodyWithMember.success) postBody = parsedPostBodyWithMember;
			else if (parsedPostBody.success) postBody = parsedPostBody;
			else return res.status(500).json({ msg: "Invalid request" });

			return res.status(200).json(
				await prisma.memberData.create({
					data: {
						member: createOrNullMember(id, postBody),
						major: postBody.data.major,
						classification: postBody.data.classification,
						graduationDate: postBody.data.graduationDate as unknown as string,
						shirtIsUnisex: postBody.data.shirtIsUnisex,
						shirtSize: postBody.data.shirtSize,
						isInACM: postBody.data.organizations?.has("ACM"),
						isInACMW: postBody.data.organizations?.has("ACM_W"),
						isInRC: postBody.data.organizations?.has("ROWDY_CREATORS"),
						isInICPC: postBody.data.organizations?.has("ICPC"),
						isInCIC: postBody.data.organizations?.has("CODING_IN_COLOR"),
						isBlackorAA: postBody.data.ethnicity?.has("BLACK_OR_AFRICAN_AMERICAN"),
						isAsian: postBody.data.ethnicity?.has("ASIAN"),
						isNAorAN: postBody.data.ethnicity?.has("NATIVE_AMERICAN_ALASKAN_NATIVE"),
						isNHorPI: postBody.data.ethnicity?.has("NATIVE_HAWAIIAN_PACIFIC_ISLANDER"),
						isHispanicorLatinx: postBody.data.ethnicity?.has("HISPANIC_OR_LATINO"),
						isWhite: postBody.data.ethnicity?.has("WHITE"),
						isMale: postBody.data.identity?.has("MALE"),
						isFemale: postBody.data.identity?.has("FEMALE"),
						isNonBinary: postBody.data.identity?.has("NON_BINARY"),
						isTransgender: postBody.data.identity?.has("TRANSGENDER"),
						isIntersex: postBody.data.identity?.has("INTERSEX"),
						doesNotIdentify: postBody.data.identity?.has("DOES_NOT_IDENTIFY"),
						otherIdentity: postBody.data.identity as unknown as string,
						address: postBody.data.address,
					},
				})
			);
	}
}

function createOrNullMember(
	id: z.SafeParseSuccess<IdType>,
	safeMemberData:
		| undefined
		| z.SafeParseSuccess<
				XOR<StrictPrettyMemberAndDataWithoutIdExtended, PrettyMemberDataWithoutIdExtended>
		  >
): Prisma.MemberCreateNestedOneWithoutDataInput | undefined {
	if (!safeMemberData) return undefined;
	if (!safeMemberData.data.nestedMemberInitMethod) {
		throw new RangeError("Must select whether to create, connect, or createOrConnect.");
	}

	if (safeMemberData.data.nestedMemberInitMethod === MemberDataCreateNestedType.enum.CONNECT) {
		return { connect: { id: id.data.id } };
	}

	if (!safeMemberData.data.name) return undefined;

	switch (safeMemberData.data.nestedMemberInitMethod) {
		case MemberDataCreateNestedType.enum.CREATE:
			return {
				connectOrCreate: {
					where: {
						id: id.data.id,
					},
					create: {
						id: id.data.id,
						email: safeMemberData.data.email,
						name: safeMemberData.data.name,
						joinDate: new Date(Date.now()),
						extendedMemberData: safeMemberData.data.extendedMemberData,
					},
				},
			};

		case MemberDataCreateNestedType.enum.CONNECT_OR_CREATE:
			return {
				create: {
					id: id.data.id,
					email: safeMemberData.data.email,
					name: safeMemberData.data.name,
					joinDate: new Date(Date.now()),
					extendedMemberData: safeMemberData.data.extendedMemberData,
				},
			};

		default:
			return undefined;
	}
}
