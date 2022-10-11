import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { prisma } from "../../../server/db/client";

interface memberItem {
	name: string;
	email: string;
	major: string;
	shortID: string;
	classificaiton: string;
	gradDate: string;
	birthday: string;
	identity: string[];
	ethnicity: string[];
	orgs: string[];
	resume?: string;
	shirtType: string;
	shirtSize: string;
	addressLineOne: string;
	addressLineTwo?: string;
	city: string;
	state: string;
	zipcode: string;
}

const memberItemValidator = z.object({
	name: z.string(),
	email: z.string(),
	major: z.string(),
	shortID: z.string(),
	classificaiton: z.string(),
	gradDate: z.string(),
	birthday: z.string(),
	identity: z.array(z.string()),
	ethnicity: z.array(z.string()),
	orgs: z.array(z.string()),
	resume: z.string().optional(),
	shirtType: z.string(),
	shirtSize: z.string(),
	addressLineOne: z.string(),
	addressLineTwo: z.string().optional(),
	city: z.string(),
	state: z.string(),
	zipcode: z.string(),
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method == "POST") {
		console.log("=========== body:");
		console.log(JSON.stringify(req.body));
		console.log("===========");

		console.log("=========== answers object:");
		console.log(JSON.stringify(req?.body?.form_response?.answers));
		console.log("===========");

		if (parseMemberItem(req?.body?.form_response?.answers)) {
			// const newMember = await prisma.member.create({
			// 	data: {
			// 		name: parsedData.data.answers[0].text,
			// 	},
			// });
			console.log("Ayyyy!");
			return res.status(200).json({});
		} else {
			return res.status(400).json({});
		}
	} else {
		return res.status(405).json({});
	}
};

// TODO: really try to make this less janky but tbh I am fed up w/ the typeform webhooks rn
// TODO: Add adress line 2 support

const parseMemberItem = (data: any) => {
	let memberToValidate: any = {};
	for (let i = 0; i <= data.length; i++) {
		let currFieldID = data[i]?.field?.id;
		if (!currFieldID) {
			break;
		} else {
			switch (currFieldID) {
				case "5uEXvAvPEtwc":
					// name
					memberToValidate.name = data[i].text;
					break;
				case "LmG2Xk4HXRCU":
					// email
					memberToValidate.email = data[i].email;
					break;
				case "qPQl5t0jayFM":
					// major
					memberToValidate.major = data[i].text;
					break;
				case "vb1MVNAySRtc":
					// abc123
					memberToValidate.shortID = data[i].text;
					break;
				case "CWk9CXm7dmC2":
					// classification
					memberToValidate.classificaiton = data[i].choice.label;
					break;
				case "RGRCnHJVl2OW":
					// grad date
					memberToValidate.gradDate = data[i].date;
					break;
				case "3BGA9wbEdHRe":
					// birthday
					memberToValidate.birthday = data[i].date;
					break;
				case "Y8V11iKjMF7H":
					// identity
					memberToValidate.identity = data[i].choices.labels;
					break;
				case "fauwIVQ2dSSn":
					// ethnicity
					memberToValidate.ethnicity = data[i].choices.labels;
					break;
				case "MerxjfB6rbLp":
					// orgs
					memberToValidate.orgs = data[i].choices.labels;
					break;
				case "EJ81qcoHyv4d":
					// resume
					memberToValidate.resume = data[i].file_url;
					break;
				case "OR5Vzvbvse3D":
					// shirt type
					memberToValidate.shirtType = data[i].choice.label;
					break;
				case "TuAEzkkOXJrF":
					// shirt size
					memberToValidate.shirtSize = data[i].choice.label;
					break;
				case "Uh4lDkRuP19o":
					// address line 1
					memberToValidate.addressLineOne = data[i].text;
					break;
				case "NRtcljbxLvEs":
					// city
					memberToValidate.city = data[i].text;
					break;
				case "ExLTAhhiVUDs":
					// state
					memberToValidate.state = data[i].text;
					break;
				case "8DcFsXk6QzIB":
					// zipcode
					memberToValidate.zipcode = data[i].text;
					break;
			}
		}
	}

	const parsedData = memberItemValidator.safeParse(memberToValidate);

	if (parsedData.success) {
		// Write to database
		console.log("Success!");
		return true;
	} else {
		console.log("Validation error: ", JSON.stringify(parsedData));
		return false;
	}
};
