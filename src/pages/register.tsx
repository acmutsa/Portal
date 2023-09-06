import type { NextPage } from "next";
import Head from "next/head";
import OpenGraph from "@/components/common/OpenGraph";
import useOpenGraph from "@/components/common/useOpenGraph";
import { useForm } from "react-hook-form";
import { useGlobalContext } from "@/components/common/GlobalContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import RootLayout from "@/components/layout/RootLayout";
import { trpc } from "@/utils/trpc";
import { EthnicityType, IdentityType, OrganizationType } from "@/utils/transform";
import { z } from "zod";

const Join: NextPage = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			organizations: z.set(OrganizationType).optional(),
			ethnicities: z.set(EthnicityType),
			identity: z.set(IdentityType.or(z.string())).optional(),
			name: "",
			major: "",
			email: "",
			abc123: "",
			classification: OrganizationType,
			graduationDate: "",
			birthday: "",
			shirtType: "",
			addressLineTwo: "",
			addressLineOne: "",
			shirtSize: "",
			zipcode: "",
			city: "",
			state: "",
			country: "",
			otherGender: "",
		},
	});
	const [selectedOtherGender, setSelectedOtherGender] = useState(false);
	const [file, setFile] = useState(null);
	const [globalState, setGlobalState] = useGlobalContext();
	const router = useRouter();
	const createProfile = trpc.member.createProfile.useMutation();

	const onSubmit = async (data: any) => {
		createProfile.mutate({ ...data });
	};
	const onInvalid = (errors: any) => console.error(errors);

	const onFileChange = (data: any) => {
		console.log(`file changed. data: ${data}`);
		setFile(data.target.files[0]);
	};

	const handleGenderInput = (data: any) => {
		if (data.target.value === "other" && selectedOtherGender) setSelectedOtherGender(false);
		if (data.target.value === "other" && !selectedOtherGender) setSelectedOtherGender(true);
	};

	useEffect(() => {
		console.log(router.route);
	}, [globalState]);
	const ogp = useOpenGraph({
		description:
			"Register to embark on the road to becoming a new member of The Association of Computing Machinery at UTSA!",
		title: "Register",
		url: "/register",
	});

	const shirtSizes: Map<string, string> = new Map([
		["extraSmall", "XS"],
		["small", "S"],
		["medium", "M"],
		["large", "L"],
		["extraLarge", "XL"],
		["doubleExtraLarge", "2XL"],
		["tripleExtraLarge", "3XL"],
	]);

	const clubs: Map<string, string> = new Map([
		["ACM", "ACM"],
		["ACM_W", "ACM-W"],
		["ROWDY_CREATORS", "Rowdy Creators"],
		["CODING_IN_COLOR", "Coding in Color"],
		["ICPC", "ICPC"],
	]);

	const identity: Map<string, string> = new Map([
		["MALE", "Male"],
		["FEMALE", "Female"],
		["NON_BINARY", "Non-binary"],
		["TRANSGENDER", "Transgender"],
		["INTERSEX", "Intersex"],
		["DOES_NOT_IDENTIFY", "Prefer not to say"],
		["other", "Let me type..."],
	]);

	const ethnicities: Map<string, string> = new Map([
		["africanAmericanOrBlack", "African American or Black"],
		["asian", "Asian"],
		["nativeAmericanOrAlaskanNative", "Native American or Alaskan Native"],
		["nativeHawaiianOrPacificIslander", "Native Hawaiian or Pacific Islander"],
		["hispanicOrLatinx", "Hispanic or Latinx"],
		["white", "White"],
	]);

	return (
		<>
			<Head>
				<title>{ogp.title}</title>
				<OpenGraph properties={ogp} />
			</Head>
			<RootLayout className={"flex justify-center items-center"}>
				<div className="p-3 pt-8">
					<div className="bg-white max-w-[25rem] p-3 rounded-xl ">
						<p className="text-lg md:text-[22px] tracking-wide md:tracking-normal font-semibold text-slate-700 font-raleway mb-2">
							Register
						</p>
						<form
							onSubmit={handleSubmit(onSubmit, onInvalid)}
							className="min-w-[20rem] sm:w-full flex flex-col font-inter justify-start p-1 pb-2 text-left "
						>
							<label className="">
								<p className="block tracking-wide text-sm md:text-base font-medium text-slate-700">
									Full Name
								</p>
								<input
									type="text"
									id="name"
									{...register("name", { required: true, maxLength: 180 })}
									className="login peer px-3 py-1.5 md:py-2 lg:py-2.5 bg-white border shadow-sm border-slate-300
									 block w-full rounded-md md:text-base placeholder-slate-400"
								/>
								<p className="mb-1 text-base invisible peer-invalid:visible text-pink-600 text-xs sm:text-sm">
									Name required.
								</p>
							</label>
							<label>
								<span className="block text-sm md:text-base font-medium text-slate-700">Email</span>
								<input
									type="email"
									id="email"
									{...register("email", { required: true, pattern: /^\S+@\S+$/i })}
									className="login peer px-3 py-1.5 md:py-2 lg:py-2.5 bg-white border shadow-sm border-slate-300
									 block w-full rounded-md md:text-base placeholder-slate-400"
								/>
								<p className="mb-1 text-[13px] invisible peer-invalid:visible text-pink-600 text-xs sm:text-sm">
									Email
								</p>
							</label>

							<label>
								<span className="block text-sm md:text-base font-medium text-slate-700">Major</span>
								<input
									type="major"
									id="major"
									{...register("major", { required: true })}
									className="login peer px-3 py-1.5 md:py-2 lg:py-2.5 bg-white border shadow-sm border-slate-300
									 block w-full rounded-md md:text-base placeholder-slate-400"
								/>
								<p className="mb-1 text-[13px] invisible peer-invalid:visible text-pink-600 text-xs sm:text-sm">
									Major
								</p>
							</label>

							<label>
								<span className="block text-sm md:text-base font-medium text-slate-700">
									abc123
								</span>
								<input
									type="abc123"
									id="abc123"
									{...register("abc123", { required: true, pattern: /^[a-z]{3}\d{3}$/i })}
									className="login peer px-3 py-1.5 md:py-2 lg:py-2.5 bg-white border shadow-sm border-slate-300
									 block w-full rounded-md md:text-base placeholder-slate-400"
								/>
								<p className="mb-1 text-[13px] invisible peer-invalid:visible text-pink-600 text-xs sm:text-sm">
									abc123
								</p>
							</label>

							<span className="block text-sm md:text-base font-medium text-slate-700">
								Classification
							</span>
							<select {...register("classification", { required: true })}>
								<option value="FRESHMAN">Freshman</option>
								<option value="SOPHOMORE">Sophomore</option>
								<option value="JUNIOR">Junior</option>
								<option value="SENIOR">Senior</option>
								<option value="Unknown">Graduate</option>
							</select>
							<p className="mb-1 text-[13px] invisible peer-invalid:visible text-pink-600 text-xs sm:text-sm">
								classification
							</p>

							<label>
								<span className="block text-sm md:text-base font-medium text-slate-700">
									Graduation date (MM/DD/YYYY)
								</span>
								<input
									type="graduationDate"
									id="graduationDate"
									{...register("graduationDate", {
										required: true,
										pattern: /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/i,
									})}
									className="login peer px-3 py-1.5 md:py-2 lg:py-2.5 bg-white border shadow-sm border-slate-300
									 block w-full rounded-md md:text-base placeholder-slate-400"
								/>
								<p className="mb-1 text-[13px] invisible peer-invalid:visible text-pink-600 text-xs sm:text-sm">
									Graduation date
								</p>
							</label>

							<label>
								<span className="block text-sm md:text-base font-medium text-slate-700">
									Birthday (MM/DD/YYYY)
								</span>
								<input
									type="birthday"
									id="birthday"
									{...register("birthday", {
										required: true,
										pattern: /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/i,
									})}
									className="login peer px-3 py-1.5 md:py-2 lg:py-2.5 bg-white border shadow-sm border-slate-300
									 block w-full rounded-md md:text-base placeholder-slate-400"
								/>
							</label>
							<p className="mb-1 text-[13px] invisible peer-invalid:visible text-pink-600 text-xs sm:text-sm">
								birthday
							</p>

							<span className="block text-sm md:text-base font-medium text-slate-700">Gender</span>
							{Array.from(identity.entries()).map((entry) => {
								const [genderAbbrev, gender] = entry;
								return (
									<>
										<div>
											<input
												{...register("identity")}
												type="checkbox"
												value={genderAbbrev}
												onChange={handleGenderInput}
											/>
											{gender}
										</div>
									</>
								);
							})}

							<p className="mb-1 text-[13px] invisible peer-invalid:visible text-pink-600 text-xs sm:text-sm">
								Gender
							</p>
							{selectedOtherGender && (
								<label>
									<span className="block text-sm md:text-base font-medium text-slate-700">
										Gender
									</span>
									<input
										{...register("otherGender", { required: true })}
										className="login peer px-3 py-1.5 md:py-2 lg:py-2.5 bg-white border shadow-sm border-slate-300
									 block w-full rounded-md md:text-base placeholder-slate-400"
									/>
									<p className="mb-1 text-[13px] invisible peer-invalid:visible text-pink-600 text-xs sm:text-sm">
										Gender
									</p>
								</label>
							)}

							<span className="block text-sm md:text-base font-medium text-slate-700">Clubs</span>
							{Array.from(clubs.entries()).map((entry) => {
								const [club, clubName] = entry;
								return (
									<>
										<div>
											<input {...register("organizations")} type="checkbox" value={club} />
											{clubName}
										</div>
									</>
								);
							})}
							<p className="mb-1 text-[13px] invisible peer-invalid:visible text-pink-600 text-xs sm:text-sm">
								Clubs
							</p>

							<span className="block text-sm md:text-base font-medium text-slate-700">
								Ethnicity
							</span>
							{Array.from(ethnicities.entries()).map((entry) => {
								const [ethnicityType, ethnicity] = entry;
								return (
									<>
										<div>
											<input {...register("ethnicities")} type="checkbox" value={ethnicity} />
											{ethnicity}
										</div>
									</>
								);
							})}
							<p className="mb-1 text-[13px] invisible peer-invalid:visible text-pink-600 text-xs sm:text-sm">
								Ethnicity
							</p>

							<span className="block text-sm md:text-base font-medium text-slate-700">
								Shirt type
							</span>
							<select {...register("shirtType", { required: true })}>
								<option value="unisex">Unisex</option>
								<option value="womens">Womens</option>
							</select>

							<span className="block text-sm md:text-base font-medium text-slate-700">
								Shirt size
							</span>
							<select {...register("shirtSize", { required: true })}>
								{Array.from(shirtSizes.entries()).map((entry) => {
									const [shirtSizeType, shirtSize] = entry;
									return (
										<>
											<option value={shirtSizeType}>{shirtSize}</option>
										</>
									);
								})}
							</select>

							<label>
								<span className="block text-sm md:text-base font-medium text-slate-700">
									Address line 1
								</span>
								<input
									id="addressLineOne"
									{...register("addressLineOne", {
										required: true,
									})}
									className="login peer px-3 py-1.5 md:py-2 lg:py-2.5 bg-white border shadow-sm border-slate-300
									 block w-full rounded-md md:text-base placeholder-slate-400"
								/>
							</label>

							<label>
								<span className="block text-sm md:text-base font-medium text-slate-700">
									Address line 2
								</span>
								<input
									id="addressLineTwo"
									{...register("addressLineTwo")}
									className="login peer px-3 py-1.5 md:py-2 lg:py-2.5 bg-white border shadow-sm border-slate-300
									 block w-full rounded-md md:text-base placeholder-slate-400"
								/>
							</label>
							<label>
								<span className="block text-sm md:text-base font-medium text-slate-700">City</span>
								<input
									id="city"
									{...register("city", { required: true })}
									className="login peer px-3 py-1.5 md:py-2 lg:py-2.5 bg-white border shadow-sm border-slate-300
									 block w-full rounded-md md:text-base placeholder-slate-400"
								/>
							</label>

							<label>
								<span className="block text-sm md:text-base font-medium text-slate-700">State</span>
								<input
									id="state"
									{...register("state", { required: true })}
									className="login peer px-3 py-1.5 md:py-2 lg:py-2.5 bg-white border shadow-sm border-slate-300
									 block w-full rounded-md md:text-base placeholder-slate-400"
								/>
							</label>
							<label>
								<span className="block text-sm md:text-base font-medium text-slate-700">
									Postal code
								</span>
								<input
									id="zipcode"
									{...register("zipcode", { required: true })}
									className="login peer px-3 py-1.5 md:py-2 lg:py-2.5 bg-white border shadow-sm border-slate-300
									 block w-full rounded-md md:text-base placeholder-slate-400"
								/>
							</label>

							<label>
								<span className="block text-sm md:text-base font-medium text-slate-700">
									Country
								</span>
								<input
									id="country"
									{...register("country", { required: true })}
									className="login peer px-3 py-1.5 md:py-2 lg:py-2.5 bg-white border shadow-sm border-slate-300
									 block w-full rounded-md md:text-base placeholder-slate-400"
								/>
							</label>
							<button
								type={"submit"}
								className="bg-sky-500 focus:bg-sky-600 hover:bg-sky-600 px-5 outline-none py-2 mt-1.5 md:mt-0 sm:py-2.5 text-sm
							 leading-5 rounded-md font-semibold text-white"
							>
								Register
							</button>
						</form>
					</div>
				</div>
			</RootLayout>
		</>
	);
};

export default Join;
