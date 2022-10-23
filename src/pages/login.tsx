import type { NextPage } from "next";
import { useState, Fragment, useEffect } from "react";
import { useForm } from "react-hook-form";
import { setCookie, removeCookies } from "cookies-next";
import { trpc } from "@/utils/trpc";
import { Dialog, Transition } from "@headlessui/react";

const EventView: NextPage = () => {
	const { register, handleSubmit, setValue } = useForm();
	const [isErrorOpen, setIsErrorOpen] = useState(false);
	const [isWorkedOpen, setIsWorkedOpen] = useState(false);

	let r = trpc.useMutation(["secured.validateLoginMatch"]);

	const closeErrorModal = () => setIsErrorOpen(false);
	const closeWorkedModal = () => setIsWorkedOpen(false);

	const didSubmit = async (p: any) => {
		let data = p;
		let result = await r.mutateAsync({
			email: data.email,
			shortID: data.shortID,
		});

		if (result.isMember) {
			// Do something
			setCookie("acm_email", data.email);
			setCookie("acm_shortID", data.shortID);
			setIsWorkedOpen(true);
		} else {
			setIsErrorOpen(true);
		}
	};

	useEffect(() => {
		// TODO: consider removing this
		removeCookies("acm_email");
		removeCookies("acm_shortID");
	}, []);

	return (
		<>
			<div className="page-view flex flex-col justify-center">
				<p className="text-lg text-white font-semibold font-raleway mb-2">
					Sign-in to the ACM-UTSA Portal
				</p>
				<div className="bg-white max-w-[50rem] self-center p-5 pt-3 rounded-xl text-center flex flex-col items-center justify-center">
					<form
						onSubmit={handleSubmit(didSubmit)}
						className="min-w-[25rem] flex flex-col justify-start"
					>
						<label className="block">
							<p className="block text-sm text-left font-medium text-slate-700">
								Email Address
							</p>
							<input
								type="email"
								placeholder="first.last@provider.com"
								id="email"
								{...register("email", { required: true })}
								className="bg-slate-200 border-none h-[2.9rem] w-full outline-1 p-[5px] rounded-md peer"
							/>
							<p className="mt-2 invisible peer-invalid:visible text-pink-600 text-sm">
								Please provide a valid email address.
							</p>
						</label>
						<label>
							<span className="block text-sm text-left font-medium text-slate-700">
								abc123
							</span>
							<input
								type="text"
								placeholder="abc123"
								id="shortID"
								{...register("shortID", {
									required: true,
									pattern: /[a-zA-Z]{3}[0-9]{3}/,
								})}
								className="bg-slate-200 border-none h-[2.9rem] w-full outline-1 p-[5px] rounded-md mb-[10px] peer"
							/>
							<p className="mt-2 invisible peer-invalid:visible text-pink-600 text-sm">
								Please provide a valid email address.
							</p>
						</label>
						<button className="h-[50px] w-full bg-primary-lighter mx-auto text-white rounded-lg font-semibold mb-[5px]">
							Login
						</button>
					</form>
				</div>
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
								<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
									<Dialog.Title
										as="h3"
										className="text-lg font-medium leading-6 text-gray-900"
									>
										Incorrect Login
									</Dialog.Title>
									<div className="mt-2">
										<p className="text-sm text-gray-500">
											Hmmm... it seems that we weren't able to find your account.
											<br />
											<br /> Please make sure that you have registered and
											then try again! <br />
											<br />
											If you believe that this may be in error, please email
											us at team@acmutsa.org or contact an officer on{" "}
											<a className="https://discord.acmutsa.org/">Discord</a>.
										</p>
									</div>

									<div className="mt-4">
										<button
											type="button"
											className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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
				<Dialog as="div" className="relative z-10" onClose={() => closeWorkedModal()}>
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
									<Dialog.Title
										as="h3"
										className="text-lg font-medium leading-6 text-gray-900"
									>
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
											onClick={() => closeWorkedModal()}
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
