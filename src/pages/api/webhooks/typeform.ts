import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { prisma } from "../../../server/db/client";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method == "POST") {
		const memberItem = z.object({
			answers: z.tuple([
				z.object({
					type: z.string(),
					text: z.string(),
					field: z.object({ id: z.string(), type: z.string(), ref: z.string() }),
				}),
				z.object({
					type: z.string(),
					email: z.string(),
					field: z.object({ id: z.string(), type: z.string(), ref: z.string() }),
				}),
				z.object({
					type: z.string(),
					text: z.string(),
					field: z.object({ id: z.string(), type: z.string(), ref: z.string() }),
				}),
				z.object({
					type: z.string(),
					text: z.string(),
					field: z.object({ id: z.string(), type: z.string(), ref: z.string() }),
				}),
				z.object({
					type: z.string(),
					choice: z.object({ label: z.string() }),
					field: z.object({ id: z.string(), type: z.string(), ref: z.string() }),
				}),
				z.object({
					type: z.string(),
					date: z.string(),
					field: z.object({ id: z.string(), type: z.string(), ref: z.string() }),
				}),
				z.object({
					type: z.string(),
					date: z.string(),
					field: z.object({ id: z.string(), type: z.string(), ref: z.string() }),
				}),
				z.object({
					type: z.string(),
					choices: z.object({
						labels: z.array(z.string()),
					}),
					field: z.object({ id: z.string(), type: z.string(), ref: z.string() }),
				}),
				z.object({
					type: z.string(),
					choices: z.object({
						labels: z.array(z.string()),
					}),
					field: z.object({ id: z.string(), type: z.string(), ref: z.string() }),
				}),
				z.object({
					type: z.string(),
					choices: z.object({
						labels: z.array(z.string()),
					}),
					field: z.object({ id: z.string(), type: z.string(), ref: z.string() }),
				}),
				z.object({
					type: z.string(),
					choice: z.object({ label: z.string() }),
					field: z.object({ id: z.string(), type: z.string(), ref: z.string() }),
				}),
				z.object({
					type: z.string(),
					choice: z.object({ label: z.string() }),
					field: z.object({ id: z.string(), type: z.string(), ref: z.string() }),
				}),
				z.object({
					type: z.string(),
					text: z.string(),
					field: z.object({ id: z.string(), type: z.string(), ref: z.string() }),
				}),
				z.object({
					type: z.string(),
					text: z.string(),
					field: z.object({ id: z.string(), type: z.string(), ref: z.string() }),
				}),
				z.object({
					type: z.string(),
					text: z.string(),
					field: z.object({ id: z.string(), type: z.string(), ref: z.string() }),
				}),
				z.object({
					type: z.string(),
					text: z.string(),
					field: z.object({ id: z.string(), type: z.string(), ref: z.string() }),
				}),
			]),
		});

		console.log("=========== body:");
		console.log(JSON.stringify(req.body));
		console.log("===========");

		console.log("=========== answers object:");
		console.log(JSON.stringify(req?.body?.form_response?.answers));
		console.log("===========");

		const parsedData = memberItem.safeParse(req?.body?.form_response?.answers);

		console.log("=========== parsed data:");
		console.log(JSON.stringify(JSON.stringify(parsedData)));
		console.log("===========");

		if (parsedData.success) {
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
	return res.status(200).json({});
};
