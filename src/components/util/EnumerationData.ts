import { EthnicityType, IdentityType, OrganizationType } from "@/utils/transform";
import organizations from "@/config/organizations.json";
import ethnicities from "@/utils/ethnicities.json";
import identities from "@/utils/identities.json";

// @ts-ignore
export const IdentityById: Record<IdentityType, string> = Object.fromEntries(
	identities.map((e) => [e.id, e.name])
);

// @ts-ignore
export const IdentityByName: Record<string, IdentityType> = Object.fromEntries(
	identities.map((e) => [e.name, e.id])
);

export const IdentityBadgeClasses: Record<IdentityType | "OTHER", string> = {
	MALE: "text-blue-700 bg-blue-200",
	FEMALE: "text-pink-700 bg-pink-200",
	NON_BINARY: "text-cyan-700 bg-cyan-200",
	TRANSGENDER: "text-violet-700 bg-violet-200",
	INTERSEX: "text-fuchsia-700 bg-fuchsia-200",
	DOES_NOT_IDENTIFY: "whitespace-nowrap text-blue-700 bg-blue-200",
	OTHER: "text-[#A020F0] bg-[#E7D5EB]",
};

// @ts-ignore TODO: Find a typescript friendly way of converting the Choice objects to Records.
export const OrganizationById: Record<OrganizationType, string> = Object.fromEntries(
	organizations.map((o) => [o.id, o.name])
);

// @ts-ignore
export const OrganizationByName: Record<string, OrganizationType> = Object.fromEntries(
	organizations.map((o) => [o.name, o.id])
);

export const OrganizationBadgeClasses: Record<OrganizationType, string> = {
	ACM: "text-secondary-700 bg-secondary-100",
	ACM_W: "text-[#F2751B] bg-[#f2e7df]",
	ICPC: "text-yellow-500 bg-yellow-100",
	ROWDY_CREATORS: "text-sky-600 bg-sky-100",
	CODING_IN_COLOR: "text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-pink-500",
};

// @ts-ignore
export const EthnicityById: Record<EthnicityType, string> = Object.fromEntries(
	ethnicities.map((e) => [e.id, e.name])
);

// @ts-ignore
export const EthnicityByName: Record<string, EthnicityType> = Object.fromEntries(
	ethnicities.map((e) => [e.name, e.id])
);

export const EthnicityBadgeClasses: Record<EthnicityType, string> = {
	WHITE: "text-cyan-700 bg-cyan-100",
	BLACK_OR_AFRICAN_AMERICAN: "text-purple-700 bg-purple-100",
	NATIVE_HAWAIIAN_PACIFIC_ISLANDER: "text-yellow-600 bg-yellow-100",
	ASIAN: "text-pink-600 bg-pink-100",
	HISPANIC_OR_LATINO: "text-emerald-600 bg-emerald-100",
	NATIVE_AMERICAN_ALASKAN_NATIVE: "text-orange-600 bg-orange-100",
};
