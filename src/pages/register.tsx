import type { NextPage } from "next";
import { Widget } from "@typeform/embed-react";
import useOpenGraph from "@/components/common/useOpenGraph";
import OpenGraph from "@/components/common/OpenGraph";
import Head from "next/head";
import RootLayout from "@/components/layout/RootLayout";
import { useForm } from "react-hook-form";
import { useGlobalContext } from "@/components/common/GlobalContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Join: NextPage = () => {
	const { register, handleSubmit } = useForm();
	const [selectedOtherGender, setSelectedOtherGender] = useState(false);
	const [file, setFile] = useState(null);
	const [globalState, setGlobalState] = useGlobalContext();
	const router = useRouter();
	const onSubmit = (data: any) => {
		console.log(data);
	};

	const onFileChange = (data: any) => {
		console.log(`file changed. data: ${data}`);
		setFile(data.target.files[0]);
	};

	const handleGenderInput = (data: any) => {
		if (data.target.value === "other" && selectedOtherGender) return setSelectedOtherGender(false);
		if (data.target.value === "other" && !selectedOtherGender) return setSelectedOtherGender(true);
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

	const shirtSizes: Map<string, string> = new Map();
	shirtSizes.set("extraSmall", "XS");
	shirtSizes.set("small", "S");
	shirtSizes.set("medium", "M");
	shirtSizes.set("large", "L");
	shirtSizes.set("extraLarge", "XL");
	shirtSizes.set("doubleExtraLarge", "2XL");
	shirtSizes.set("tripleExtraLarge", "3XL");

	return (
		<>
			<Head>
				<title>{ogp.title}</title>
				<OpenGraph properties={ogp} />
			</Head>
			<RootLayout>
				<div className="p-3 pt-8">
					<div className="bg-white max-w-[25rem] self-center p-3 rounded-xl text-center flex flex-col items-center justify-center">
						<p className="text-lg md:text-[22px] tracking-wide md:tracking-normal font-semibold text-slate-700 font-raleway mb-2">
							Register
						</p>
						<form
							onSubmit={handleSubmit(onSubmit)}
							className="min-w-[20rem] sm:w-full flex flex-col font-inter justify-start p-1 pb-2 text-left"
						>
							<label className="">
								<p className="block tracking-wide text-sm md:text-base font-medium text-slate-700">
									Full Name
								</p>
								<input
									type="text"
									id="fullName"
									{...register("fullName", { required: true, maxLength: 180 })}
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
								<option value="freshman">Freshman</option>
								<option value="sophomore">Sophomore</option>
								<option value="junior">Junior</option>
								<option value="senior">Senior</option>
								<option value="graduate">Graduate</option>
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
							<fieldset {...register("gender", { required: true })} onInput={handleGenderInput}>
								<input type="checkbox" id="male" name="male" value="male" />
								<label htmlFor="male">Male</label>
								<br />
								<input type="checkbox" id="female" name="female" value="female" />
								<label htmlFor="female">Female</label>
								<br />
								<input type="checkbox" id="nonBinary" name="nonBinary" value="nonBinary" />
								<label htmlFor="nonBinary">Non-binary</label>
								<br />
								<input type="checkbox" id="transgender" name="transgender" value="transgender" />
								<label htmlFor="transgender">Transgender</label>
								<br />
								<input type="checkbox" id="intersex" name="intersex" value="intersex" />
								<label htmlFor="intersex">Intersex</label>
								<br />
								<input
									type="checkbox"
									id="preferNotToSay"
									name="preferNotToSay"
									value="preferNotToSay"
								/>
								<label htmlFor="preferNotToSay">Prefer not to say</label>
								<br />
								<input type="checkbox" id="other" name="other" value="other" />
								<label htmlFor="other">Let me type...</label>
							</fieldset>
							<p className="mb-1 text-[13px] invisible peer-invalid:visible text-pink-600 text-xs sm:text-sm">
								gender
							</p>
							{selectedOtherGender && (
								<label>
									<span className="block text-sm md:text-base font-medium text-slate-700">
										Gender
									</span>
									<input
										type="gender"
										id="gender"
										{...register("gender", {
											required: true,
										})}
										className="login peer px-3 py-1.5 md:py-2 lg:py-2.5 bg-white border shadow-sm border-slate-300
									 block w-full rounded-md md:text-base placeholder-slate-400"
									/>
									<p className="mb-1 text-[13px] invisible peer-invalid:visible text-pink-600 text-xs sm:text-sm">
										Gender
									</p>
								</label>
							)}

							<span className="block text-sm md:text-base font-medium text-slate-700">
								Ethnicity
							</span>
							<fieldset {...register("ethnicity", { required: true })}>
								<input
									type="checkbox"
									id="africanAmericanOrBlack"
									name="africanAmericanOrBlack"
									value="africanAmericanOrBlack"
								/>
								<label htmlFor="africanAmericanOrBlack">African American or Black</label>
								<br />
								<input type="checkbox" id="asian" name="asian" value="asian" />
								<label htmlFor="asian">Asian</label>
								<br />
								<input
									type="checkbox"
									id="nativeAmericanOrAlaskanNative"
									name="nativeAmericanOrAlaskanNative"
									value="nativeAmericanOrAlaskanNative"
								/>
								<label htmlFor="nativeAmericanOrAlaskanNative">
									Native American / Alaskan Native
								</label>
								<br />
								<input
									type="checkbox"
									id="nativeHawaiianOrPacificIslander"
									name="nativeHawaiianOrPacificIslander"
									value="nativeHawaiianOrPacificIslander"
								/>
								<label htmlFor="nativeHawaiianOrPacificIslander">
									Native Hawaiian or Pacific Islander
								</label>
								<br />
								<input
									type="checkbox"
									id="hispanicOrLatinx"
									name="hispanicOrLatinx"
									value="hispanicOrLatinx"
								/>
								<label htmlFor="hispanicOrLatinx">Hispanic / Latinx</label>
								<br />
								<input type="checkbox" id="white" name="white" value="white" />
								<label htmlFor="white">White</label>
							</fieldset>

							<span className="block text-sm md:text-base font-medium text-slate-700">
								What organizations are you interested in?
							</span>
							<fieldset {...register("orgs", { required: true })}>
								<input type="checkbox" id="acm" name="acm" value="acm" />
								<label htmlFor="acm">ACM</label>
								<br />
								<input type="checkbox" id="acmW" name="acmW" value="acmW" />
								<label htmlFor="acmW">ACM-W</label>
								<br />
								<input
									type="checkbox"
									id="rowdyCreators"
									name="rowdyCreators"
									value="rowdyCreators"
								/>
								<label htmlFor="rowdyCreators">Rowdy Creators</label>
								<br />
								<input type="checkbox" id="icpc" name="icpc" value="icpc" />
								<label htmlFor="icpc">ICPC</label>
								<br />
								<input
									type="checkbox"
									id="codingInColor"
									name="codingInColor"
									value="codingInColor"
								/>
								<label htmlFor="codingInColor">Coding in Color</label>
								<br />
								<input
									type="checkbox"
									id="acmHackathons"
									name="acmHackathons"
									value="acmHackathons"
								/>
								<label htmlFor="acmHackathons">ACM Hackathons</label>
							</fieldset>
							<span className="block text-sm md:text-base font-medium text-slate-700">
								Drop your resume here!
							</span>
							<div>
								<input type={"file"} onChange={onFileChange} />
							</div>

							<span className="block text-sm md:text-base font-medium text-slate-700">
								Shirt type
							</span>
							<fieldset {...register("shirtType", { required: true })}>
								<input type="checkbox" id="unisex" name="unisex" value="unisex" />
								<label htmlFor="unisex">Unisex</label>
								<br />
								<input type="checkbox" id="womens" name="womens" value="womens" />
								<label htmlFor="womens">Womens</label>
							</fieldset>

							<span className="block text-sm md:text-base font-medium text-slate-700">
								Shirt size
							</span>
							<fieldset {...register("shirtSize", { required: true })}>
								{Array.from(shirtSizes.entries()).map((entry) => {
									const [shirtSizeType, shirtSize] = entry;
									return (
										<>
											<input
												type="checkbox"
												id={shirtSizeType}
												name={shirtSizeType}
												value={shirtSizeType}
											/>
											<label htmlFor={shirtSizeType}>{shirtSize}</label>
											<br />
										</>
									);
								})}
							</fieldset>

							<label>
								<span className="block text-sm md:text-base font-medium text-slate-700">
									Address line 1
								</span>
								<input
									id="addressLineOne"
									{...register("addressLineOne", {
										required: true,
										pattern: /\b\d+\s+[a-zA-Z0-9\s.-]+\b/i,
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
								<span className="block text-sm md:text-base font-medium text-slate-700">
									City, Region
								</span>
								<input
									id="cityAndRegion"
									{...(register("cityAndRegion"), { required: true })}
									className="login peer px-3 py-1.5 md:py-2 lg:py-2.5 bg-white border shadow-sm border-slate-300
									 block w-full rounded-md md:text-base placeholder-slate-400"
								/>
							</label>

							<label>
								<span className="block text-sm md:text-base font-medium text-slate-700">
									Postal code
								</span>
								<input
									id="postalCode"
									{...(register("postalCode"), { required: true })}
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
									{...(register("country"), { required: true })}
									className="login peer px-3 py-1.5 md:py-2 lg:py-2.5 bg-white border shadow-sm border-slate-300
									 block w-full rounded-md md:text-base placeholder-slate-400"
								/>
							</label>
							<button
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
