/**
 * Utilities for transforming data representation, especially with likeness to the MemberData table.
 */

import type { MemberData, Member, Prisma } from "@prisma/client";
import { z } from "zod";
import { lightFormat, parse, subYears } from "date-fns";
import { getSemesterRange } from "@/utils/helpers";

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

interface Choice<IDType = string, NameType = string> {
	id: IDType;
	name: NameType;
}

const semesters: Choice[] = getSemesterRange(
	[3, Math.max(2022, now.getUTCFullYear() - 3)],
	now.getUTCFullYear() + 1
).map((s) => ({
	id: s,
	name: s,
}));

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
	checkins: z.record(z.number().min(0)),
});
export type PrettyMemberData = z.infer<typeof PrettyMemberDataSchema>;
export const PrettyMemberDataWithoutIdSchema = PrettyMemberDataSchema.omit({ id: true });
export type PrettyMemberDataWithoutId = z.infer<typeof PrettyMemberDataWithoutIdSchema>;

export const toPrettyMemberData = (
	member: Member,
	memberData: MemberData,
	memberCheckins: Prisma.CheckinGetPayload<{ include: { event: true } }>[]
): PrettyMemberData => {
	const organizations = new Set<OrganizationType>();
	const ethnicities = new Set<EthnicityType>();
	const identities = new Set<IdentityType | string>();
	let checkins: { [key: string]: number } = {};
	for (const semester of semesters) {
		checkins[semester.name.toLowerCase().replace(/ /g, "")] = 0;
	}
	for (const checkin of memberCheckins) {
		if (checkins[checkin.event.semester.toLowerCase().replace(/ /g, "")]) {
			checkins[checkin.event.semester.toLowerCase().replace(/ /g, "")] += 1;
		} else {
			checkins[checkin.event.semester.toLowerCase().replace(/ /g, "")] = 1;
		}
	}

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
		checkins: checkins,
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
