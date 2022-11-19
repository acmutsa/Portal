import { prisma, Checkin, Event } from "@/server/db/client";
import { isBefore, isAfter } from "date-fns";

/**
 * Returns true if checking in to a specific event is available given the form
 * open and form close times for the event.
 * @param event The event (must have formOpen/formClose or eventStart/eventEnd attributes selected)
 * @param useEventTimes If true, the check will use the event times instead of the form open times.
 */
export function isCheckinOpen(event: Event, useEventTimes: boolean = false): boolean {
	if (event.forcedIsOpen) return true;
	const now = new Date();
	if (useEventTimes) return isBefore(event.eventStart, now) && isAfter(event.eventEnd, now);
	return isBefore(event.formOpen, now) && isAfter(event.formClose, now);
}

/**
 * Check if a checkin exists for a given member and event.
 * @param memberId
 * @param eventId
 * @return boolean If true, the user can create a new checkin for this event. If false, a checkin
 * likely already exists.
 */
export async function getCheckin(memberId: string, eventId: string): Promise<Checkin | null> {
	return await prisma.checkin.findUnique({
		where: {
			eventID_memberID: {
				eventID: eventId,
				memberID: memberId,
			},
		},
	});
}

/**
 * Get all checkins from a specific user.
 * @param memberId
 */
export async function getMemberCheckins(memberId: string): Promise<Checkin[]> {
	return await prisma.checkin.findMany({
		where: {
			memberID: memberId,
		},
	});
}

/**
 * Get all checkins associated with a specific event.
 * @param eventId
 */
export async function getEventCheckins(eventId: string): Promise<Checkin[]> {
	return await prisma.checkin.findMany({
		where: {
			eventID: eventId,
		},
	});
}

/**
 * Create a new checkin for a given member & event.
 * @param memberId
 * @param eventId
 * @param inPerson
 */
export async function createCheckin(
	memberId: string,
	eventId: string,
	inPerson: boolean
): Promise<Checkin | null> {
	if ((await getCheckin(memberId, eventId)) == null) {
		return await prisma.checkin.create({
			data: {
				eventID: eventId,
				memberID: memberId,
				isInPerson: inPerson,
			},
		});
	}

	return null;
}

/**
 * Delete a checkin for a given member & event.
 * @param memberId
 * @param eventId
 * @throws RecordNotFound
 */
export async function deleteCheckin(memberId: string, eventId: string): Promise<Checkin> {
	return await prisma.checkin.delete({
		where: {
			eventID_memberID: {
				eventID: eventId,
				memberID: memberId,
			},
		},
	});
}
