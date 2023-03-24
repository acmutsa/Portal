import { env } from "@/env/server.mjs";
import { RestCredentialsOutputType } from "@/utils/transform";
import { NextApiResponse } from "next";

export async function validateAdminRest(
	credentials: RestCredentialsOutputType,
	res: NextApiResponse
) {
	if (
		credentials.admin_username !== env.ADMIN_UNAME ||
		credentials.admin_password !== env.ADMIN_PASS
	) {
		return res.status(401);
	}
}