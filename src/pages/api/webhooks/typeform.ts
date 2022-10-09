import type { NextApiRequest, NextApiResponse } from "next";
import { parse } from "path";
import { z } from "zod";
import { prisma } from "../../../server/db/client";

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

export default async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method == "POST") {
		// const parsedData = memberItem.safeParse(req.body.form_response.answers);

		// if (parsedData.success) {
		// 	const newMember = await prisma.member.create({
		//         data: {
		//             name: parsedData.data.answers[0].text
		//         }
		//     });
		// } else {
		// 	res.status(400);
		// }

		console.log(JSON.stringify(req.body));
		res.status(200);
	} else {
		res.status(405);
	}
};
