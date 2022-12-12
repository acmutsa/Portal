import { IdentityType } from "@/utils/transform";

/**
 * Various colors
 */
export const IdentityColors: Record<IdentityType | "OTHER", string> = {
	MALE: "text-blue-700 bg-blue-200",
	FEMALE: "text-pink-700 bg-pink-200",
	NON_BINARY: "text-cyan-700 bg-cyan-200",
	TRANSGENDER: "text-violet-700 bg-violet-200",
	INTERSEX: "text-fuchsia-700 bg-fuchsia-200",
	DOES_NOT_IDENTIFY: "text-blue-700 bg-blue-200",
	OTHER: "text-[#A020F0] bg-[#E7D5EB]",
};
