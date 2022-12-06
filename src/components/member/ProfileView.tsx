import majors from "@/utils/majors.json";
import { Dispatch, FunctionComponent, useMemo, useRef, useState } from "react";
import Badge from "@/components/common/Badge";
import Detail from "@/components/common/Detail";
import { lightFormat } from "date-fns";
import ModifiableDetail, { ModifiableDetailFormValues } from "@/components/common/ModifiableDetail";
import { z } from "zod";
import { trpc } from "@/utils/trpc";
import { Toast } from "primereact/toast";
import { setProperty } from "dot-prop";
import { MemberWithData } from "@/server/controllers/member";
import { getCookie, setCookie } from "cookies-next";
import { cookies } from "@/utils/constants";
import WarningDialog from "@/components/member/WarningDialog";
import { AiFillWarning } from "react-icons/ai";
import ModifiableDetailMultiselect, {
	ModifiableDetailMultiselectFormValues,
} from "@/components/common/ModifiableDetailMultiselect";
import { Choice } from "@/components/forms/CustomSelect";
import "primereact/resources/themes/lara-light-indigo/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css";

type ModifiableDetailForms = ModifiableDetailFormValues | ModifiableDetailMultiselectFormValues;

interface ProfileViewProps {
	member: MemberWithData;
	status: boolean;
}

const BadgeStatusColors = {
	success: "bg-green-100 text-green-800",
	in_progress: "bg-yellow-100 text-yellow-800",
	failure: "bg-red-100 text-red-800",
};

const emailParser = z.string().email();

const ProfileView: FunctionComponent<ProfileViewProps> = ({
	member: initialMember,
	status,
}: ProfileViewProps) => {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogPromise, setDialogPromise] = useState<Dispatch<
		boolean | PromiseLike<boolean>
	> | null>(null);
	const [member, setMember] = useState(initialMember);

	const { statusColor, statusText } = useMemo(() => {
		return status
			? {
					statusColor: BadgeStatusColors.success,
					statusText: "Complete",
			  }
			: {
					statusColor: BadgeStatusColors.in_progress,
					statusText: "In Progress",
			  };
	}, [status]);

	const formattedJoinDate = lightFormat(member.joinDate, "MM/dd/yyyy");
	const updateProfile = trpc.useMutation(["member.updateProfile"], {
		onSuccess: (data) => {
			// Populate ProfileView with the latest data.
			setMember((prevState) => ({ ...prevState, ...data }));
			showSuccess();

			// Change the member email cookie if the email property has changed.
			// This shouldn't help anyone survive lockouts by an officer changing their email, so
			// while I believe this to not be as optimized of a check, it works.
			const newMemberEmail = data?.email;
			if (newMemberEmail != null && newMemberEmail != getCookie(cookies.member_email))
				setCookie(cookies.member_email, newMemberEmail);
		},
		onError: (error) => {
			showError(error.message);
		},
	});
	// TODO: Switch from Primereact toast to a headless, Tailwind-based Toast system
	const toast = useRef<Toast>(null);

	const showSuccess = useMemo(() => {
		return (message?: string) => {
			toast?.current?.show({
				severity: "success",
				summary: "Profile Updated",
				detail: message ?? "The profile was updated successfully.",
				life: 3000,
			});
		};
	}, [toast]);

	const showError = useMemo(() => {
		return (message?: string) => {
			toast?.current?.show({
				severity: "error",
				summary: "Failed to Update Profile",
				detail: message ?? "No message provided.",
				life: 4000,
			});
		};
	}, [toast]);

	const updateHandler = useMemo(() => {
		/**
		 * A memoized function that returns submit handlers for each of the ModifiableDetail components.
		 * Each of the ModifiableDetail components hook directly into the same mutation.
		 * Use `transformFunction` for the Multiselect components in order to transform a Choice object
		 * into a string, if needed (like for the Major property).
		 */
		return (path: string, transformFunction?: (value: string | Choice | null) => any) => {
			return async ({ value }: ModifiableDetailForms) => {
				// use the transform function if available
				if (transformFunction != undefined) value = transformFunction(value);

				// setProperty is required for any MemberData table properties (major, ethnicity, classification)
				const args = setProperty({}, path, value!);

				// Prevent multiple mutations at the same time.
				if (updateProfile.isLoading) return Promise.resolve(false);

				// TODO: See if mutateAsync works well here.
				return new Promise<boolean>((resolve) => {
					updateProfile.mutate(args, {
						onSuccess: () => resolve(true),
						onError: () => resolve(false),
					});
				});
			};
		};
	}, [updateProfile, showError]);

	return (
		<>
			<Toast ref={toast} />
			<WarningDialog
				title="Change email address"
				description="Since your email address is part of your login, changing it may lock you out of your account.
				 While we will attempt to maintain your session, no guarantees can be made, and you may have to login again.
				 Be careful about what you type here."
				onClose={(value: boolean) => {
					// Don't show the dialog again
					if (value) localStorage.setItem("email-warning-dialog", "true");
					if (dialogPromise) dialogPromise(value); // Resolve the promise for the modifiable email
					setDialogOpen(false);
				}}
				open={dialogOpen}
				iconParentClass="bg-red-100"
				icon={<AiFillWarning className="h-6 w-6 text-red-600" />}
			/>
			<dl className="overflow-hidden overflow-y-auto relative">
				<ModifiableDetail
					id="name"
					placeholder="John Doe"
					label="Name"
					initialValue={member.name}
					onSubmit={updateHandler("name")}
				>
					{member.name}
				</ModifiableDetail>
				<ModifiableDetail
					id="email"
					placeholder="you@example.org"
					inputType="email"
					label="Email address"
					initialValue={member.email}
					rules={{
						email: (email) => {
							if (email == null || email.length == 0) return "Required.";
							return emailParser.safeParse(email).success || "Invalid email address.";
						},
					}}
					onSubmit={updateHandler("email")}
					onModify={() => {
						// If we've seen the dialog, skip it and return a Promise that resolves instantly.
						if (localStorage.getItem("email-warning-dialog") === "true")
							return Promise.resolve(true);

						setDialogOpen(true);
						return new Promise<boolean>((resolve) => {
							// Skip the dialog if we've seen it before.
							setDialogPromise(() => resolve);
						});
					}}
				>
					{member.email}
				</ModifiableDetail>
				<Detail label="myUTSA ID">{member.id}</Detail>
				<ModifiableDetailMultiselect
					id="major"
					label="Major"
					choices={majors}
					initialValue={majors.find((c) => c.name == member.data?.major)}
					onSubmit={updateHandler("data.major", (c) => {
						// Since we only want to send the name of the major back, we transform the Choice into a string
						return (c as Choice).name;
					})}
				>
					{member.data?.major ?? "Unknown"}
				</ModifiableDetailMultiselect>
				<Detail label="Join Date">{formattedJoinDate}</Detail>
				<Detail label="Classification">{member.data?.classification ?? "Unknown"}</Detail>
				<div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
					<dt className="text-sm font-medium text-gray-500">Membership Status</dt>
					<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
						<Badge colorClass={statusColor}>{statusText}</Badge>
					</dd>
				</div>
			</dl>
		</>
	);
};

interface ProfileViewProps {
	name: string;
	id: string;
	email: string;
}

export default ProfileView;
