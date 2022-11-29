/**
 * Utilities for transforming data representation, especially with likeness to the MemberData table.
 */

import type { MemberData, Member } from "@prisma/client";
import { z } from "zod";
import { lightFormat, parse, subYears } from "date-fns";

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

export const OrganizationEnum = z.enum([
	"ACM",
	"ACM_W",
	"ROWDY_CREATORS",
	"ICPC",
	"CODING_IN_COLOR",
]);
const ClassificationEnum = z.enum(["FRESHMAN", "SOPHOMORE", "JUNIOR", "SENIOR", "Unknown"]);
const EthnicityEnum = z.enum([
	"WHITE",
	"BLACK_OR_AFRICAN_AMERICAN",
	"NATIVE_AMERICAN_ALASKAN_NATIVE",
	"ASIAN",
	"NATIVE_HAWAIIAN_PACIFIC_ISLANDER",
	"HISPANIC_OR_LATINO",
]);
const IdentityEnum = z.enum([
	"MALE",
	"FEMALE",
	"NON_BINARY",
	"TRANSGENDER",
	"INTERSEX",
	"DOES_NOT_IDENTIFY",
]);

// TODO: Figure out why required doesn't allow a mask like partial, remove all .optionals for .partial and .required

export const PrettyMemberDataSchema = z.object({
	id: z.string().min(1),
	major: z.string().optional(),
	classification: ClassificationEnum.optional(),
	graduationDate: z
		.object({
			month: z.number().min(1).max(12),
			year: z
				.number()
				.min(1970)
				.max(currentYear + 10),
		})
		.optional(),
	organizations: z.set(OrganizationEnum).optional(),
	birthday: z.date().min(subYears(now, 50)).max(subYears(now, 14)).optional(),
	ethnicity: z.set(EthnicityEnum).optional(),
	identity: z.set(z.string()).optional(),
});
export type PrettyMemberData = z.infer<typeof PrettyMemberDataSchema>;
export const PrettyMemberDataWithoutIdSchema = PrettyMemberDataSchema.omit({ id: true });
export type PrettyMemberDataWithoutId = z.infer<typeof PrettyMemberDataWithoutIdSchema>;
type Classification = z.TypeOf<typeof ClassificationEnum>;
type Organization = z.TypeOf<typeof OrganizationEnum>;
type Ethnicity = z.TypeOf<typeof EthnicityEnum>;

// TODO: Create a toPrettyMemberData function to transform the database representation into a usable version.

export const toPrettyMemberData = (member: Member, memberData: MemberData): PrettyMemberData => {
	const organizations = new Set<Organization>();
	const ethnicities = new Set<Ethnicity>();
	const identities = new Set<string>();

	if (memberData.isInACM) organizations.add(OrganizationEnum.enum.ACM);
	if (memberData.isInACMW) organizations.add(OrganizationEnum.enum.ACM_W);
	if (memberData.isInRC) organizations.add(OrganizationEnum.enum.ROWDY_CREATORS);
	if (memberData.isInICPC) organizations.add(OrganizationEnum.enum.ICPC);
	if (memberData.isInCIC) organizations.add(OrganizationEnum.enum.CODING_IN_COLOR);

	if (memberData.isBlackorAA) ethnicities.add(EthnicityEnum.enum.BLACK_OR_AFRICAN_AMERICAN);
	if (memberData.isAsian) ethnicities.add(EthnicityEnum.enum.ASIAN);
	if (memberData.isNAorAN) ethnicities.add(EthnicityEnum.enum.NATIVE_AMERICAN_ALASKAN_NATIVE);
	if (memberData.isNHorPI) ethnicities.add(EthnicityEnum.enum.NATIVE_HAWAIIAN_PACIFIC_ISLANDER);
	if (memberData.isHispanicorLatinx) ethnicities.add(EthnicityEnum.enum.HISPANIC_OR_LATINO);
	if (memberData.isWhite) ethnicities.add(EthnicityEnum.enum.WHITE);

	if (memberData.isMale) identities.add(IdentityEnum.enum.MALE);
	if (memberData.isFemale) identities.add(IdentityEnum.enum.FEMALE);
	if (memberData.isNonBinary) identities.add(IdentityEnum.enum.NON_BINARY);
	if (memberData.isTransgender) identities.add(IdentityEnum.enum.TRANSGENDER);
	if (memberData.isIntersex) identities.add(IdentityEnum.enum.INTERSEX);
	if (memberData.doesNotIdentify) identities.add(IdentityEnum.enum.DOES_NOT_IDENTIFY);
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
		classification: ClassificationEnum.safeParse(memberData.classification).success
			? (memberData.classification as Classification)
			: undefined,
		graduationDate,
		organizations: organizations,
		birthday: memberData.Birthday ? new Date(memberData.Birthday) : undefined,
		ethnicity: ethnicities,
		identity: identities,
	};
};

export function toMemberData(data: PrettyMemberData): MemberData {
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
		if (data.organizations.has(OrganizationEnum.enum.ACM)) organizationData.isInACM = true;
		if (data.organizations.has(OrganizationEnum.enum.ACM_W)) organizationData.isInACMW = true;
		if (data.organizations.has(OrganizationEnum.enum.ROWDY_CREATORS))
			organizationData.isInRC = true;
		if (data.organizations.has(OrganizationEnum.enum.ICPC)) organizationData.isInICPC = true;
		if (data.organizations.has(OrganizationEnum.enum.CODING_IN_COLOR))
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
		if (data.ethnicity.has(EthnicityEnum.enum.WHITE)) ethnicityData.isWhite = true;
		if (data.ethnicity.has(EthnicityEnum.enum.ASIAN)) ethnicityData.isAsian = true;
		if (data.ethnicity.has(EthnicityEnum.enum.BLACK_OR_AFRICAN_AMERICAN))
			ethnicityData.isBlackorAA = true;
		if (data.ethnicity.has(EthnicityEnum.enum.HISPANIC_OR_LATINO))
			ethnicityData.isHispanicorLatinx = true;
		if (data.ethnicity.has(EthnicityEnum.enum.NATIVE_AMERICAN_ALASKAN_NATIVE))
			ethnicityData.isNAorAN = true;
		if (data.ethnicity.has(EthnicityEnum.enum.NATIVE_HAWAIIAN_PACIFIC_ISLANDER))
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
		if (IdentityEnum.safeParse(data.identity).success) {
			for (let val of data.identity) {
				if (data.identity.has(IdentityEnum.enum.MALE)) identityData.isMale = true;
				else if (data.identity.has(IdentityEnum.enum.FEMALE)) identityData.isFemale = true;
				else if (data.identity.has(IdentityEnum.enum.NON_BINARY)) identityData.isNonBinary = true;
				else if (data.identity.has(IdentityEnum.enum.TRANSGENDER))
					identityData.isTransgender = true;
				else if (data.identity.has(IdentityEnum.enum.INTERSEX)) identityData.isIntersex = true;
				else if (data.identity.has(IdentityEnum.enum.DOES_NOT_IDENTIFY))
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
