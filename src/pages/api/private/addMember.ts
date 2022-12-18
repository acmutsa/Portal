import type { NextApiRequest, NextApiResponse } from "next";

import type { Prisma } from "@prisma/client";
import { z } from "zod";

const addMember = async (req: NextApiRequest, res: NextApiResponse) => {
	res.status(200).json({ example: "test" });
};

export default addMember;
