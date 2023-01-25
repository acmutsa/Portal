import { Context, createRouter } from "@/server/router/context";

import { z } from "zod";
import * as trpc from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { validateAdmin } from "@/server/router/admin";
import {
	getAllMembers,
	getMember,
	MemberWithData,
	PrettyMemberSchema,
	updateMember,
	updateMemberData,
} from "@/server/controllers/member";
import { getCheckin, isCheckinOpen } from "@/server/controllers/checkin";
import { getPreciseSemester, isValuesNull } from "@/utils/helpers";
import { PrettyMemberDataWithoutIdSchema } from "@/utils/transform";
import { Member } from "@prisma/client";

// Calling this method while passing your request context will ensure member credentials were provided.
export const validateMember = async (ctx: Context, extendedData: boolean = false) => {
	if (ctx.email == null || ctx.id == null)
		throw new trpc.TRPCError({
			code: "UNAUTHORIZED",
			message:
				"Member-level credentials are required for this resource, whereas nothing was provided.",
		});

	const member = await getMember(ctx.id.toLowerCase(), extendedData);

	if (member == null || member.email != ctx.email.toLowerCase())
		throw new trpc.TRPCError({
			code: "UNAUTHORIZED",
			message:
				"Valid member-level credentials are required for this resource; what was provided was invalid.",
		});

	return member;
};

export const memberRouter = createRouter()
	.mutation("loggedIn", {
		input: z
			.object({
				email: z.string(),
				id: z.string(),
			})
			.nullish(),
		output: z.boolean(),
		async resolve({ input, ctx }) {
			let email = ctx.email;
			let id = ctx.id;

			// If input is specified, use those automatically. Both won't be null/undefined by schema.
			if (input) {
				email = input.email;
				id = input.id;
			} else {
				// If either are nullish from context, we can't verify a login.
				if (!email || !id) return false;
			}

			let member = await getMember(id.toLowerCase());

			return member != null && member.email == email.toLowerCase();
		},
	})
	/**
	 * Checks if the given form is available to check in to.
	 * Requires member login.
	 * Provide either the event pageID or full ID.
	 */
	.query("checkinOpen", {
		input: z
			.object({
				pageID: z.string().min(1),
				id: z.string().min(1),
			})
			.partial()
			.refine(
				(data) => data.pageID != undefined || data.id != undefined,
				"Either pageID or id should be specified"
			),
		async resolve({ ctx, input }) {
			if (input.pageID === undefined && input.id === undefined) await validateMember(ctx);
			const event = await ctx.prisma.event.findUnique({
				where: input.pageID != undefined ? { pageID: input.pageID } : { id: input.id },
			});

			if (event == null)
				throw new TRPCError({
					message: "The event you are looking for does not exist.",
					code: "NOT_FOUND",
				});

			return isCheckinOpen(event);
		},
	})
	.mutation("updateProfile", {
		input: z
			.object({
				name: z.string(),
				email: z.string().email(),
				data: PrettyMemberDataWithoutIdSchema,
			})
			.partial(), // Everything is optional, it is valid to send an empty object.
		async resolve({ ctx, input }) {
			// Check authentication first. Yes, this is intentionally before the empty input short-circuit to avoid potential confusion.
			const self = await validateMember(ctx, input.data != null);

			// Quit early if the input has nothing to update.
			if (isValuesNull(input)) return;

			// Latest version of the member & memberData tables will be stored here.
			let latestMember: Member | MemberWithData | null = null;

			// Extract Member table information from the input. Is strictly referencing the keys a good idea here?
			const baseMemberData = PrettyMemberSchema.parse({ name: input.name, email: input.email });
			// Member table updates
			if (!isValuesNull(baseMemberData)) {
				const receivedMember = await updateMember(self.id, baseMemberData);
				if (receivedMember != null) latestMember = receivedMember;
			}

			// MemberData table updates
			if (input.data != null && !isValuesNull(input.data)) {
				const receivedMemberData = await updateMemberData(self.id, input.data, true);
				latestMember = { ...latestMember, data: receivedMemberData } as MemberWithData;
			}

			return latestMember;
		},
	})
	.mutation("checkin", {
		input: z
			.object({
				pageID: z.string(),
				id: z.string(),
				feedback: z.string().nullish(),
				inPerson: z.boolean(),
			})
			.partial({ pageID: true, id: true })
			.refine(
				(data) => data.pageID !== undefined || data.id !== undefined,
				"Either pageID or id should be specified"
			),
		async resolve({ ctx, input }) {
			const self = await validateMember(ctx);
			const event = await ctx.prisma.event.findUnique({
				where: input.pageID != undefined ? { pageID: input.pageID } : { id: input.id },
			});

			if (event == null)
				throw new TRPCError({
					message: "The event you are trying to check into does not exist.",
					code: "NOT_FOUND",
				});

			const existing_checkin = await getCheckin(self.id, event.id);

			if (!isCheckinOpen(event))
				throw new TRPCError({
					message: "The form for this event is closed.",
					code: "PRECONDITION_FAILED",
				});

			await ctx.prisma.checkin.upsert({
				where: {
					eventID_memberID: {
						eventID: event.id,
						memberID: self.id,
					},
				},
				create: {
					event: {
						connect: {
							id: event.id,
						},
					},
					member: {
						connect: {
							id: self.id,
						},
					},
					isInPerson: input.inPerson,
					feedback: input.feedback,
				},
				update: {
					isInPerson: input.inPerson,
					feedback: input.feedback,
					timestamp: new Date(),
				},
			});
		},
	})
	.query("me", {
		async resolve({ ctx }) {
			return await validateMember(ctx);
		},
	})
	.query("getAll", {
		async resolve({ ctx }) {
			await validateAdmin(ctx);
			return getAllMembers(true);
		},
	})
	.query("countActive", {
		async resolve({ ctx }) {
			await validateAdmin(ctx);

			// Count the total number of members that have checked in at least once
			const activeMembersPromise = ctx.prisma.member.count({
				where: {
					checkins: {
						some: {
							event: {
								semester: getPreciseSemester(),
							},
						},
					},
				},
			});

			const allMembersPromise = ctx.prisma.member.count();

			const [activeMembers, allMembers] = await Promise.all([
				activeMembersPromise,
				allMembersPromise,
			]);

			return {
				active: activeMembers,
				inactive: allMembers - activeMembers,
			};
		},
	});
