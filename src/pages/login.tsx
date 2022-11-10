import type { NextPage } from "next";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { setCookie } from "cookies-next";
import { trpc } from "@/utils/trpc";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import { useGlobalContext } from "@/components/common/GlobalContext";
import useOpenGraph from "@/components/common/useOpenGraph";
import OpenGraph from "@/components/common/OpenGraph";
import Disclosure from "@/components/util/Disclosure";
import Head from "next/head";

const EventView: NextPage = () => {
	const { register, handleSubmit, setValue } = useForm();
	const [isErrorOpen, setIsErrorOpen] = useState(false);
	const [isWorkedOpen, setIsSuccessOpen] = useState(false);
	const [globalState, setGlobalState] = useGlobalContext();
	const loggedIn = trpc.useMutation(["member.loggedIn"]);
	const router = useRouter();

	const ogp = useOpenGraph({
		description:
			"Login to your ACM-UTSA Member account to view your membership progress and check in to ongoing events.",
		title: "Login",
		url: "/login",
	});

	// Sub-par navigation guard
	useEffect(() => {
		// TODO: Improve navigation guards to not show login page at all before redirecting when logged in.
		if (globalState.loggedIn && !isWorkedOpen) {
			router.replace("/member/status");
		}
	}, [globalState]);

	const closeErrorModal = () => setIsErrorOpen(false);
	const closeSuccessModal = () => setIsSuccessOpen(false);

	const didSubmit = async (data: any) => {
		console.log("Checking login details");
		let isLoggedIn = await loggedIn.mutateAsync({ email: data.email, shortID: data.shortID });
		if (isLoggedIn) {
			// Setup cookies, open success modal
			setCookie("member_email", data.email);
			setCookie("member_shortID", data.shortID);
			setIsSuccessOpen(true);
			setGlobalState({ ...globalState, loggedIn: true });
		} else {
			setIsErrorOpen(true);
		}
	};

	return (
		<>
			<Head>
				<title>{ogp.title}</title>
				<OpenGraph properties={ogp} />
			</Head>
			<div className="page-view bg-darken flex justify-center">
				<div className="my-auto px-3">
					<div className="bg-white max-w-[25rem] self-center p-3 rounded-xl text-center flex flex-col items-center justify-center">
						<p className="text-lg md:text-[22px] tracking-wide md:tracking-normal font-semibold text-slate-700 font-raleway mb-2">
							Membership Portal
						</p>
						<form
							onSubmit={handleSubmit(didSubmit)}
							className="min-w-[20rem] sm:w-full flex flex-col font-inter justify-start p-1 pb-2 text-left"
						>
							<label className="">
								<p className="block tracking-wide text-sm md:text-base font-medium text-slate-700">Email</p>
								<input
									type="email"
									placeholder="you@example.com"
									id="email"
									{...register("email", { required: true })}
									className="login peer px-3 py-1.5 md:py-2 lg:py-2.5 bg-white border shadow-sm border-slate-300
									 block w-full rounded-md md:text-base placeholder-slate-400"
								/>
								<p className="mb-1 text-base invisible peer-invalid:visible text-pink-600 text-xs sm:text-sm">
									Please provide a valid email address.
								</p>
							</label>
							<label>
								<span className="block text-sm md:text-base font-medium text-slate-700">myUTSA ID</span>
								<input
									type="text"
									placeholder="abc123"
									minLength={6}
									maxLength={6}
									id="shortID"
									{...register("shortID", {
										required: true,
										pattern: /^[a-zA-Z]{3}[0-9]{3}$/,
										minLength: 6,
										maxLength: 6,
									})}
									className="login peer px-3 py-1.5 md:py-2 lg:py-2.5 bg-white border shadow-sm border-slate-300
									 block w-full rounded-md md:text-base placeholder-slate-400"
								/>
								<p className="mb-1 text-[13px] invisible peer-invalid:visible text-pink-600 text-xs sm:text-sm">
									Please provide a valid abc123.
								</p>
							</label>
							<button className="bg-sky-500 focus:bg-sky-600 hover:bg-sky-600 px-5 outline-none py-2 mt-1.5 md:mt-0 sm:py-2.5 text-sm
							 leading-5 rounded-md font-semibold text-white">
								Login
							</button>
						</form>
						<p className="text-center text-slate-600 text-sm md:text-base">
							Not yet a member?{" "}
							<a href={"/register"} className="text-slate-700 underline">
								Register
							</a>
						</p>
					</div>
				</div>
				<Disclosure />
			</div>
			<Transition appear show={isErrorOpen} as={Fragment}>
				<Dialog as="div" className="relative z-10" onClose={() => closeErrorModal()}>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-black bg-opacity-25" />
					</Transition.Child>

					<div className="fixed inset-0 overflow-y-auto">
						<div className="flex min-h-full items-center justify-center p-4 text-center">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 scale-95"
								enterTo="opacity-100 scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 scale-100"
								leaveTo="opacity-0 scale-95"
							>
								<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left
								 align-middle shadow-xl transition-all">
									<Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
										Invalid Login
									</Dialog.Title>
									<div className="mt-2">
										<p className="text-sm text-gray-500">
											We weren't able to find your membership.
											<br /> Please make sure that you have registered and then try again! <br />
											If you believe that this may be in error, please email us at team@acmutsa.org
											or contact an officer on{" "}
											<a className="https://discord.acmutsa.org/">Discord</a>.
										</p>
									</div>
									<div className="w-full mt-4 flex">
										<button
											type="button"
											className="align	-self-end inline-flex justify-center rounded-md border border-transparent
											bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none
											focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
											onClick={() => closeErrorModal()}
										>
											Got it!
										</button>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
			<Transition appear show={isWorkedOpen} as={Fragment}>
				<Dialog as="div" className="relative z-10" onClose={() => closeSuccessModal()}>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-black bg-opacity-25" />
					</Transition.Child>

					<div className="fixed inset-0 overflow-y-auto">
						<div className="flex min-h-full items-center justify-center p-4 text-center">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 scale-95"
								enterTo="opacity-100 scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 scale-100"
								leaveTo="opacity-0 scale-95"
							>
								<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
									<Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
										Success!
									</Dialog.Title>
									<div className="mt-2">
										<p className="text-sm text-gray-500">
											You are now logged in! Thanks for being a member of ACM!
										</p>
									</div>

									<div className="mt-4">
										<button
											type="button"
											className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
											onClick={() => {
												closeSuccessModal();
												router.push("/member/status");
											}}
										>
											Great!
										</button>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</>
	);
};

export default EventView;
