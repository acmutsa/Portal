import { differenceInDays, format, isAfter, isBefore } from "date-fns";
import { Event } from "@/server/db/client";
import organizations from "@/config/organizations.json";
import { Choice } from "@/components/forms/CustomSelect";

export function pluralize(count: number) {
	return count != 1 ? "s" : "";
}

export const absUrl = (path: string): string => {
	path = path.trim();
	if (path.startsWith("http")) return path;
	if (path.indexOf("/") === 0) path = path.substring(1);

	const appUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

	return `${appUrl}/${path}`;
};

export type Weekday =
	| "monday"
	| "tuesday"
	| "wednesday"
	| "thursday"
	| "friday"
	| "saturday"
	| "sunday";

const weekdayIndex = {
	sunday: 0,
	monday: 1,
	tuesday: 2,
	wednesday: 3,
	thursday: 4,
	friday: 5,
	saturday: 6,
};

// Modifies a date object to become the nearest weekday as specified
export const moveToNearestWeekday = (date: Date, weekday: Weekday) => {
	const targetIndex = weekdayIndex[weekday];
	if (date.getDay() != targetIndex)
		date.setDate(date.getDate() - ((date.getDay() + (7 - targetIndex)) % 7));
};

// Does not operate in the future, startDate < endDate.
export const getDates = (
	step: number,
	startDate: Date,
	endDate: Date | null = null,
	weekday: Weekday | null = null
) => {
	// If a weekday is specified, the first date returned will be of that weekday. If a step of 7 is used, then all will
	// be of that same weekday.
	if (weekday) moveToNearestWeekday(startDate, weekday);

	// If not specified, the endDate is assumed to be today. The end date is not guaranteed to be in the returned array.
	endDate = endDate ?? new Date();

	const weeks = Math.floor(differenceInDays(endDate, startDate) / 7);
	if (weeks <= 0) return [];

	const tempDate = new Date(startDate);
	return [
		tempDate,
		...Array.apply(null, Array(weeks)).map((_, i: number) => {
			tempDate.setDate(tempDate.getDate() + 7);
			return new Date(tempDate);
		}),
	];
};

export const sum = (a: number, b: number) => a + b;

export const removeEmpty = (object: Record<string, {} | null | undefined>): { [k: string]: {} } => {
	const filteredEntries: [string, {}][] = Object.entries(object).filter(
		(kv): kv is [string, {}] => kv[1] != null
	);
	return Object.fromEntries(filteredEntries);
};

export const removeEmptyItems = (array: any[]): {}[] => {
	return array.filter((v): v is {} => v != null);
};

export const generateGoogleCalendarLink = (
	start: Date,
	end: Date,
	title: string | null = null,
	description: string | null = null,
	location: string | null = null
) => {
	const startString = new Date(start || "").toISOString().replace(/[^\w\s]/gi, "");
	const endString = new Date(end || "").toISOString().replace(/[^\w\s]/gi, "");

	const params = new URLSearchParams(
		removeEmpty({
			action: "TEMPLATE",
			text: title,
			details: description,
			dates: `${startString}/${endString}`,
			location: location,
		}) as Record<string, string>
	);
	return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

export function ltrim(input: string, characters: string) {
	let start = 0;
	while (input[start] !== undefined && characters.indexOf(input[start]!) >= 0) {
		start += 1;
	}
	return input.substring(start);
}

export const formatDateCell = (value: Date) => {
	const hoverText = format(value, "EEEE, LLL do, yyyy 'at' h:mm:ss aaaa");
	const shortText = format(value, "y/MM/dd h:mma z");
	return (
		<span className="whitespace-nowrap bg-slate-300 p-1 rounded-lg font-medium" title={hoverText}>
			{shortText}
		</span>
	);
};

export function classNames(...classes: (string | null | undefined)[]) {
	return classes.filter(Boolean).join(" ");
}

export const range = (start: number, stop: number, step: number = 1) =>
	Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);

/**
 * Returns true if checking in to a specific event is available given the form
 * open and form close times for the event.
 * @param event The event (must have formOpen/formClose or eventStart/eventEnd attributes selected)
 * @param useEventTimes If true, the check will use the event times instead of the form open times.
 * @param now The time to be compared to in all checks. Defaults to now.
 */
export function isCheckinOpen(
	event: Event,
	useEventTimes: boolean = false,
	now: Date | null = null
): boolean {
	if (event.forcedIsOpen) return true;
	now = now ?? new Date();
	if (useEventTimes) return isBefore(event.eventStart, now) && isAfter(event.eventEnd, now);
	return isBefore(event.formOpen, now) && isAfter(event.formClose, now);
}

/**
 * Returns true if all values on the object are null or undefined.
 * @param object The object to check the values of.
 */
export function isValuesNull(object: Object) {
	return Object.values(object).every((v) => v == null);
}

/**
 * A simple function to retrieve a organization from the JSON list by its identifier.
 * @param organizationIdentifier The identifier of the organization.
 */
export function getOrganization(organizationIdentifier: string): Choice | null {
	return organizations.find((org) => org.id == organizationIdentifier) ?? null;
}

/**
 * Return true if any pair (left, right) of items in the array returns true given the function.
 * @param array {any[]} The array of items. Nothing will happen if less than 2 items exist.
 * @param func {(a: any, b: any) => boolean} The callback function. Takes two inputs, returns a boolean.
 */
export function pairwiseMatch(array: any[], func: (a: any, b: any) => boolean) {
	for (let i = 0; i < array.length - 1; i++) {
		if (func(array[i], array[i + 1])) return true;
	}
	return false;
}

export function getSemester(time: Date | null = null): "Spring" | "Summer" | "Fall" {
	if (time == null) time = new Date();
	const month = time.getUTCMonth();

	if (month < 5) return "Spring";
	if (month < 7) return "Summer";
	return "Fall";
}

/**
 * Get the semester according to a date (defaults to now)
 * @param time The time. If not specified, it defaults to now.
 */
export function getPreciseSemester(time: Date | null = null): string {
	if (time == null) time = new Date();
	const year = time.getUTCFullYear();
	return `${getSemester(time)} ${year}`;
}

const seasonMapping: Record<number | string, number | string> = {
	Spring: 1,
	Summer: 2,
	Fall: 3,
	1: "Spring",
	2: "Summer",
	3: "Fall",
};

export function getSemesterRange(
	start: [season: 1 | 2 | 3, year: number],
	endYear: number,
	includeSummer: boolean = false
): string[] {
	const results: string[] = [];
	let currentYear = start[1];

	// First year
	range(start[0], 3).forEach((n) => {
		if (n != 2 || includeSummer) results.push(`${seasonMapping[n]} ${currentYear}`);
	});

	// Other years, if applicable
	if (start[1] != endYear)
		range(start[1] + 1, endYear).forEach((year) => {
			results.push(`Spring ${year}`);
			if (includeSummer) results.push(`Summer ${year}`);
			results.push(`Fall ${year}`);
		});

	return results;
}
