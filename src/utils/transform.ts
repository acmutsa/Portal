/**
 * Utilities for transforming data representation, especially with likeness to the MemberData table.
 */

import { MemberData } from "@prisma/client";
import { z } from "zod";
import { lightFormat, subYears } from "date-fns";

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
		Object.entries(obj as ArrayLike<TRecord>).map(([k, v]) => [k, v ?? defaultValue])
	) as TRecord;
}

const OrganizationEnum = z.enum(["ACM", "ACM_W", "ROWDY_CREATORS", "ICPC", "CODING_IN_COLOR"]);
const ClassificationEnum = z.enum(["FRESHMAN", "SOPHOMORE", "JUNIOR", "SENIOR"]);
const EthnicityEnum = z.enum([
	"WHITE",
	"BLACK_OR_AFRICAN_AMERICAN",
	"AMERICAN_INDIAN_OR_ALASKA_NATIVE",
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
	ethnicity: EthnicityEnum.optional(),
	identity: IdentityEnum.or(z.string()).optional(),
});
type PrettyMemberData = z.infer<typeof PrettyMemberDataSchema>;

// TODO: Create a toPrettyMemberData function to transform the database representation into a usable version.

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
		// Else-if required, only one value allowed to be true. Otherwise, ALL NULL.
		if (data.ethnicity == EthnicityEnum.enum.WHITE) ethnicityData.isWhite = true;
		else if (data.ethnicity == EthnicityEnum.enum.ASIAN) ethnicityData.isAsian = true;
		else if (data.ethnicity == EthnicityEnum.enum.AMERICAN_INDIAN_OR_ALASKA_NATIVE)
			ethnicityData.isNAorAN = true;
		else if (data.ethnicity == EthnicityEnum.enum.NATIVE_HAWAIIAN_PACIFIC_ISLANDER)
			ethnicityData.isNHorPI = true;
		else if (data.ethnicity == EthnicityEnum.enum.BLACK_OR_AFRICAN_AMERICAN)
			ethnicityData.isBlackorAA = true;
		else if (data.ethnicity == EthnicityEnum.enum.HISPANIC_OR_LATINO)
			ethnicityData.isHispanicorLatinx = true;
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
			if (data.identity == IdentityEnum.enum.MALE) identityData.isMale = true;
			else if (data.identity == IdentityEnum.enum.FEMALE) identityData.isFemale = true;
			else if (data.identity == IdentityEnum.enum.INTERSEX) identityData.isIntersex = true;
			else if (data.identity == IdentityEnum.enum.NON_BINARY) identityData.isNonBinary = true;
			else if (data.identity == IdentityEnum.enum.TRANSGENDER) identityData.isTransgender = true;
			else if (data.identity == IdentityEnum.enum.DOES_NOT_IDENTIFY)
				identityData.doesNotIdentify = true;
		} else identityData.otherIdentity = data.identity;
		identityData = defaultValues<IdentityData>(identityData, false);
	}

	return { ...basicData, ...identityData, ...ethnicityData, ...organizationData, ...identityData };
}
