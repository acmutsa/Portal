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
			<div className="page-view flex items-center">
				<div className="bg-white max-w-[800px] w-full mx-auto min-h-[400px] max-h-[500px] h-full rounded-xl text-center flex flex-col items-center justify-center p-[10px]">
					<h1 className="text-5xl font-extrabold font-raleway">Welcome!</h1>
					<p className="text-lg font-extrabold font-raleway mb-[40px]">Please Login Below</p>
					<form onSubmit={handleSubmit(didSubmit)} className="min-w-[400px]">
						<input
							type="email"
							placeholder="person@example.com"
							id="email"
							{...register("email", { required: true })}
							className="bg-slate-200 border-none h-[50px] w-full focus:outline-none p-[5px] rounded-md mb-[10px]"
						/>
						<input
							type="text"
							placeholder="abc123"
							id="shortID"
							{...register("shortID", { required: true, pattern: /[a-zA-Z]{3}[0-9]{3}/ })}
							className="bg-slate-200 border-none h-[50px] w-full focus:outline-none p-[5px] rounded-md mb-[10px]"
						/>
						<button className="h-[50px] w-full bg-primary-darker text-white rounded-lg font-semibold mx-[5px] mb-[5px] max-w-[300px] mt-[40px]">
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
									<Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
										Incorrect Login
									</Dialog.Title>
									<div className="mt-2">
										<p className="text-sm text-gray-500">
											Hmmm... it seems that we weren't able to find your account.
											<br />
											<br /> Please make sure that you have registed and then try again! <br />
											<br />
											If you belive that this may be in error, please email us at team@acmutsa.org
											or contact an officer on{" "}
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
