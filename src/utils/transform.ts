/**
 * Utilities for transforming data representation, especially with likeness to the MemberData table.
 */

import type {Member, MemberData} from "@prisma/client";
import {Prisma} from "@prisma/client";
import {z} from "zod";
import {lightFormat, parse, subYears} from "date-fns";
import {NextApiRequest, NextApiResponse} from "next";
import {isValuesNull, removeEmpty} from "@/utils/helpers";
import {prisma} from "@/server/db/client";
import {PrettyMember, PrettyMemberSchema} from "@/server/controllers/member";

interface OrganizationData {
	isInACM: boolean | null;
	isInACMW: boolean | null;
	isInRC: boolean | null;
	isInICPC: boolean | null;
	isInCIC: boolean | null;
}

interface EthnicityData {
	isBlackorAA: boolean | null;
	isAsian: boolean | null;
	isNAorAN: boolean | null;
	isNHorPI: boolean | null;
	isHispanicorLatinx: boolean | null;
	isWhite: boolean | null;
}

interface IdentityData {
	isMale: boolean | null;
	isFemale: boolean | null;
	isNonBinary: boolean | null;
	isTransgender: boolean | null;
	isIntersex: boolean | null;
	doesNotIdentify: boolean | null;
	otherIdentity: string | null;
}

const now = new Date();
const currentYear = now.getFullYear();

/**
 * Provide a default value to all values in an object.
 * @param obj The object to have values defaulted to defaultValue
 * @param defaultValue The non-nullish value to be used for all of object's key-value pairs.
 */
function defaultValues<TRecord>(obj: TRecord, defaultValue: any): TRecord {
	if (defaultValue == null) return obj;
	return Object.fromEntries(
		Object.entries(obj as any).map(([k, v]) => [k, v ?? defaultValue])
	) as TRecord;
}

export const OrganizationType = z.enum([
	"ACM",
	"ACM_W",
	"ROWDY_CREATORS",
	"ICPC",
	"CODING_IN_COLOR",
]);
export type OrganizationType = z.infer<typeof OrganizationType>;
export const ClassificationType = z.enum(["FRESHMAN", "SOPHOMORE", "JUNIOR", "SENIOR", "Unknown"]);
export type ClassificationType = z.infer<typeof ClassificationType>;
export const EthnicityType = z.enum([
	"WHITE",
	"BLACK_OR_AFRICAN_AMERICAN",
	"NATIVE_AMERICAN_ALASKAN_NATIVE",
	"ASIAN",
	"NATIVE_HAWAIIAN_PACIFIC_ISLANDER",
	"HISPANIC_OR_LATINO",
]);
export type EthnicityType = z.infer<typeof EthnicityType>;
export const IdentityType = z.enum([
	"MALE",
	"FEMALE",
	"NON_BINARY",
	"TRANSGENDER",
	"INTERSEX",
	"DOES_NOT_IDENTIFY",
]);
export type IdentityType = z.infer<typeof IdentityType>;

export const MemberDataCreateNestedSchema = z.enum([
	"CONNECT",
	"CREATE",
	"CONNECT_OR_CREATE",
]);
export type MemberDataCreateNestedType = z.infer<typeof MemberDataCreateNestedSchema>;

export const FilterSchema = z.enum(["ID", "NAME", "EMAIL", "JOINDATE", "EXTENDEDMEMBERDATA"]);
export type FilterType = z.infer<typeof FilterSchema>;
export const FilterValueSchema = z.union([z.string(), z.date(), z.string().email()]);
export type FilterValueType = z.infer<typeof FilterValueSchema>;
export const RequestWithFilterSchema = z.object({
	id: z.string().trim().optional(),
	name: z.string().trim().optional(),
	email: z.string().email().trim().optional(),
	extendedMemberData: z.string().trim().optional(),
	filter: FilterSchema.optional(),
	filterValue: FilterValueSchema.optional(),
});
export type RequestWithFilterType = z.infer<typeof RequestWithFilterSchema>;

export function containsMember(member: PrettyMemberAndDataExtendedType) {
	return (member as PrettyMember).email !== undefined;
}

/**
 * A function for determining whether the field in a WhereInput is unique.
 * @param where A field in the Member table that may or may not be unique.
 */
export function isUniqueWhereInput(where: Prisma.MemberWhereInput | Prisma.MemberWhereUniqueInput | undefined)
	: where is Prisma.MemberWhereUniqueInput {
	return (where as Prisma.MemberWhereUniqueInput).id !== undefined
		|| (where as Prisma.MemberWhereUniqueInput).email !== undefined;
}

/**
 * A function that returns the MemberWhereInput or MemberWhereUniqueInput associated with
 * the given filter.
 * @param filter The property used to filter which models to wrap before updating.
 * @param filterValue The value of the filter.
 */
export function getWhereInput(
	filter: FilterType | undefined,
	filterValue: FilterValueType | undefined
): Prisma.MemberWhereInput | Prisma.MemberWhereUniqueInput | undefined {
	if (!filter && !filterValue || typeof filterValue !== "string") return;

	switch (filter) {
		case FilterSchema.enum.ID:
			return {id: filterValue};
		case FilterSchema.enum.NAME:
			return {name: filterValue};
		case FilterSchema.enum.EMAIL:
			return {email: filterValue};
		case FilterSchema.enum.JOINDATE:
			return {joinDate: filterValue};
		case FilterSchema.enum.EXTENDEDMEMBERDATA:
			return {extendedMemberData: filterValue};
	}
}

export const UpsertSchema = z.object({upsert: z.boolean()});
export type UpsertType = z.infer<typeof UpsertSchema>;

/**
 * A method for determining whether the client specified to create a new
 * record if the record specified to edit did not exist.
 * @param req
 * @param res
 */
export function upsert(req: NextApiRequest, res: NextApiResponse): boolean | void {
	const upsert = UpsertSchema.safeParse(req.body);
	if (!upsert.success) {
		return res.status(500).json({msg: "Invalid request"});
	}

	return upsert.data.upsert;
}


// will 100% take in MemberData, but the Member will be optional
export function createOrNullMember(
	id: string,
	safeMemberData:
		z.SafeParseSuccess<PrettyMemberAndDataExtendedType | StrictPrettyMemberAndDataExtendedType>
): Prisma.MemberCreateNestedOneWithoutDataInput | undefined {
	if (!safeMemberData.data.nestedMemberInitMethod) {
		throw new RangeError("Must select whether to create, connect, or createOrConnect.");
	}

	if (safeMemberData.data.nestedMemberInitMethod === MemberDataCreateNestedSchema.enum.CONNECT) {
		return {connect: {id: id}};
	}

	if (
		!safeMemberData.data.name
		|| !safeMemberData.data.email
		|| !safeMemberData.data.extendedMemberData
	) {
		return undefined;
	}


	switch (safeMemberData.data.nestedMemberInitMethod) {
		case MemberDataCreateNestedSchema.enum.CREATE:
			return {
				connectOrCreate: {
					where: {
						id: id,
					},
					create: {
						id: id,
						email: safeMemberData.data.email,
						name: safeMemberData.data.name,
						joinDate: new Date(Date.now()),
						extendedMemberData: safeMemberData.data.extendedMemberData,
					},
				},
			};

		case MemberDataCreateNestedSchema.enum.CONNECT_OR_CREATE:
			return {
				create: {
					id: id,
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

/**
 * A method for updating the MemberData table associated with a given ID.
 * @param req
 * @param res
 * @param id The ID of the member associated with the MemberData.
 */
export async function updateMemberAndData(
	req: NextApiRequest,
	res: NextApiResponse,
	id: string
): Promise<MemberData | void> {
	const prettyMemberData = PrettyMemberDataWithoutIdSchema.safeParse(req.body);
	if (!prettyMemberData.success) {
		return res.status(500).json({msg: "Invalid request"});
	}
	if (isValuesNull(prettyMemberData.data)) {
		throw new RangeError("At least one value in 'data' must be non-empty");
	}

	const nonPrettyMemberData = toMemberData({id, ...prettyMemberData.data});

	if (upsert(req, res)) {
		return await prisma.memberData.upsert({
			where: {memberID: id},
			create: nonPrettyMemberData,
			update: removeEmpty(nonPrettyMemberData),
			include: {member: false}
		});
	} else {
		return await prisma.memberData.update({
			where: {memberID: id as string},
			data: nonPrettyMemberData,
		});
	}
}

/**
 * A zod schema containing properties for a member. This is a stricter version of
 * PrettyMemberSchema, that is used for the purposes of enforcing the
 * shape of POST requests.
 */
export const StrictPrettyMemberSchema = z.object({
	id: z.string().length(6).trim(),
	email: z.string().email({message: "Invalid email address"}).trim(),
	name: z.string().min(1, {message: "Name must be at least 1 character"}).trim(),
	extendedMemberData: z.string(),
});
export type StrictPrettyMemberType = z.infer<typeof StrictPrettyMemberSchema>;

// TODO: Figure out why required doesn't allow a mask like partial, remove all .optionals for .partial and .required

export const PrettyMemberDataSchema = z.object({
	id: z.string().min(1),
	major: z.string().optional(),
	classification: ClassificationType.optional(),
	graduationDate: z
		.object({
			month: z.number().min(1).max(12),
			year: z
				.number()
				.min(1970)
				.max(currentYear + 10),
		})
		.optional(),
	organizations: z.set(OrganizationType).optional(),
	birthday: z.date().min(subYears(now, 50)).max(subYears(now, 14)).optional(),
	ethnicity: z.set(EthnicityType).optional(),
	identity: z.set(IdentityType.or(z.string())).optional(),
	resume: z.string().optional(),
	shirtIsUnisex: z.boolean().optional(),
	shirtSize: z.string().optional(),
	address: z.string().optional(),
});
export type PrettyMemberDataType = z.infer<typeof PrettyMemberDataSchema>;
export const PrettyMemberDataWithoutIdSchema = PrettyMemberDataSchema.omit({id: true});
export type PrettyMemberDataWithoutIdType = z.infer<typeof PrettyMemberDataWithoutIdSchema>;
export const PrettyMemberDataWithoutIdExtendedSchema = PrettyMemberDataWithoutIdSchema.extend({
	nestedMemberInitMethod: MemberDataCreateNestedSchema,
});
export const PrettyMemberDataExtendedSchema = PrettyMemberDataSchema.extend({
	nestedMemberInitMethod: MemberDataCreateNestedSchema.optional(),
});
export type PrettyMemberDataExtendedType = z.infer<typeof PrettyMemberDataExtendedSchema>;
export type PrettyMemberDataWithoutIdExtendedType = z.infer<typeof PrettyMemberDataWithoutIdExtendedSchema>;
export const IdSchema = z.object({id: z.string()});
export type IdType = z.infer<typeof IdSchema>;
export const StrictPrettyMemberAndDataWithoutIdExtendedSchema = PrettyMemberDataWithoutIdExtendedSchema
	.extend(StrictPrettyMemberSchema.shape);
export type StrictPrettyMemberAndDataWithoutIdExtendedType = z
	.infer<typeof StrictPrettyMemberAndDataWithoutIdExtendedSchema>;
export const StrictPrettyMemberAndDataExtendedSchema = PrettyMemberDataExtendedSchema
	.extend(StrictPrettyMemberSchema.shape);
export type StrictPrettyMemberAndDataExtendedType = z.infer<typeof StrictPrettyMemberAndDataExtendedSchema>;
export const PrettyMemberAndDataExtendedSchema = PrettyMemberDataExtendedSchema
	.extend(PrettyMemberSchema.shape);
export type PrettyMemberAndDataExtendedType = z.infer<typeof PrettyMemberAndDataExtendedSchema>;
export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
export type XOR<T, U> = (T | U) extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;

export const toPrettyMemberData = (member: Member, memberData: MemberData): PrettyMemberDataType => {
	const organizations = new Set<OrganizationType>();
	const ethnicities = new Set<EthnicityType>();
	const identities = new Set<IdentityType | string>();

	if (memberData.isInACM) organizations.add(OrganizationType.enum.ACM);
	if (memberData.isInACMW) organizations.add(OrganizationType.enum.ACM_W);
	if (memberData.isInICPC) organizations.add(OrganizationType.enum.ICPC);
	if (memberData.isInRC) organizations.add(OrganizationType.enum.ROWDY_CREATORS);
	if (memberData.isInCIC) organizations.add(OrganizationType.enum.CODING_IN_COLOR);

	if (memberData.isWhite) ethnicities.add(EthnicityType.enum.WHITE);
	if (memberData.isAsian) ethnicities.add(EthnicityType.enum.ASIAN);
	if (memberData.isHispanicorLatinx) ethnicities.add(EthnicityType.enum.HISPANIC_OR_LATINO);
	if (memberData.isBlackorAA) ethnicities.add(EthnicityType.enum.BLACK_OR_AFRICAN_AMERICAN);
	if (memberData.isNAorAN) ethnicities.add(EthnicityType.enum.NATIVE_AMERICAN_ALASKAN_NATIVE);
	if (memberData.isNHorPI) ethnicities.add(EthnicityType.enum.NATIVE_HAWAIIAN_PACIFIC_ISLANDER);

	if (memberData.isMale) identities.add(IdentityType.enum.MALE);
	if (memberData.isFemale) identities.add(IdentityType.enum.FEMALE);
	if (memberData.isNonBinary) identities.add(IdentityType.enum.NON_BINARY);
	if (memberData.isTransgender) identities.add(IdentityType.enum.TRANSGENDER);
	if (memberData.isIntersex) identities.add(IdentityType.enum.INTERSEX);
	if (memberData.doesNotIdentify) identities.add(IdentityType.enum.DOES_NOT_IDENTIFY);
	if (memberData.otherIdentity) identities.add(memberData.otherIdentity);

	let graduationDate: { year: number; month: number } | undefined = undefined;
	if (memberData.graduationDate != null) {
		try {
			const realGraduationDate = parse(memberData.graduationDate, "y-LL", new Date());
			graduationDate = {
				month: realGraduationDate.getUTCMonth(),
				year: realGraduationDate.getUTCFullYear(),
			};
		} catch (e) {
			console.log(e);
		}
	}

	// Note: Do not return null or similar values. Empty values should always be made undefined.
	return {
		id: member.id,
		major: memberData.major ?? undefined,
		classification: ClassificationType.safeParse(memberData.classification).success
			? (memberData.classification as ClassificationType)
			: undefined,
		graduationDate,
		organizations: organizations,
		birthday: memberData.Birthday ? new Date(memberData.Birthday) : undefined,
		ethnicity: ethnicities,
		identity: identities,
	};
};

export function toMemberData(data: PrettyMemberDataType): MemberData {
	const basicData = {
		memberID: data.id,
		major: data.major ?? null,
		classification: data.classification != null ? data.classification : null,
		graduationDate:
			data.graduationDate != null
				? `${data.graduationDate.month}/${data.graduationDate.year}`
				: null,
		shirtIsUnisex: null,
		shirtSize: null,
		Birthday: data.birthday != null ? lightFormat(data.birthday, "MM/dd/yyyy") : null,
		address: null,
	};

	let organizationData: OrganizationData = {
		isInACM: null,
		isInACMW: null,
		isInRC: null,
		isInICPC: null,
		isInCIC: null,
	};

	if (data.organizations != null) {
		if (data.organizations.has(OrganizationType.enum.ACM)) organizationData.isInACM = true;
		if (data.organizations.has(OrganizationType.enum.ACM_W)) organizationData.isInACMW = true;
		if (data.organizations.has(OrganizationType.enum.ROWDY_CREATORS))
			organizationData.isInRC = true;
		if (data.organizations.has(OrganizationType.enum.ICPC)) organizationData.isInICPC = true;
		if (data.organizations.has(OrganizationType.enum.CODING_IN_COLOR))
			organizationData.isInCIC = true;
		organizationData = defaultValues<OrganizationData>(organizationData, false);
	}

	let ethnicityData: EthnicityData = {
		isBlackorAA: null,
		isAsian: null,
		isNAorAN: null,
		isNHorPI: null,
		isHispanicorLatinx: null,
		isWhite: null,
	};

	if (data.ethnicity != null) {
		if (data.ethnicity.has(EthnicityType.enum.WHITE)) ethnicityData.isWhite = true;
		if (data.ethnicity.has(EthnicityType.enum.ASIAN)) ethnicityData.isAsian = true;
		if (data.ethnicity.has(EthnicityType.enum.BLACK_OR_AFRICAN_AMERICAN))
			ethnicityData.isBlackorAA = true;
		if (data.ethnicity.has(EthnicityType.enum.HISPANIC_OR_LATINO))
			ethnicityData.isHispanicorLatinx = true;
		if (data.ethnicity.has(EthnicityType.enum.NATIVE_AMERICAN_ALASKAN_NATIVE))
			ethnicityData.isNAorAN = true;
		if (data.ethnicity.has(EthnicityType.enum.NATIVE_HAWAIIAN_PACIFIC_ISLANDER))
			ethnicityData.isNHorPI = true;

		// if (data.ethnicity == EthnicityEnum.enum.WHITE) ethnicityData.isWhite = true;
		// if (data.ethnicity == EthnicityEnum.enum.ASIAN) ethnicityData.isAsian = true;
		// if (data.ethnicity == EthnicityEnum.enum.AMERICAN_INDIAN_OR_ALASKA_NATIVE) ethnicityData.isNAorAN = true;
		// if (data.ethnicity == EthnicityEnum.enum.NATIVE_HAWAIIAN_PACIFIC_ISLANDER) ethnicityData.isNHorPI = true;
		// if (data.ethnicity == EthnicityEnum.enum.BLACK_OR_AFRICAN_AMERICAN) ethnicityData.isBlackorAA = true;
		// if (data.ethnicity == EthnicityEnum.enum.HISPANIC_OR_LATINO) ethnicityData.isHispanicorLatinx = true;
		ethnicityData = defaultValues<EthnicityData>(ethnicityData, false);
	}

	let identityData: IdentityData = {
		isMale: null,
		isFemale: null,
		isNonBinary: null,
		isTransgender: null,
		isIntersex: null,
		doesNotIdentify: null,
		otherIdentity: null,
	};

	if (data.identity != null) {
		if (IdentityType.safeParse(data.identity).success) {
			for (let val of data.identity) {
				if (data.identity.has(IdentityType.enum.MALE)) identityData.isMale = true;
				else if (data.identity.has(IdentityType.enum.FEMALE)) identityData.isFemale = true;
				else if (data.identity.has(IdentityType.enum.NON_BINARY)) identityData.isNonBinary = true;
				else if (data.identity.has(IdentityType.enum.TRANSGENDER))
					identityData.isTransgender = true;
				else if (data.identity.has(IdentityType.enum.INTERSEX)) identityData.isIntersex = true;
				else if (data.identity.has(IdentityType.enum.DOES_NOT_IDENTIFY))
					identityData.doesNotIdentify = true;
				else {
					// Only first value in sequence is taken.
					if (identityData.otherIdentity == null) identityData.otherIdentity = val;
				}
			}

			identityData = defaultValues<IdentityData>(identityData, false);
		}
	}
	return {
		...basicData,
		...identityData,
		...ethnicityData,
		...organizationData,
		...identityData,
	};
}
