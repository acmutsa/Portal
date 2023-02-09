import { NextPage } from "next";
import AdminRootLayout from "@/components/admin/AdminRootLayout";
import EditEventView from "@/components/admin/EditEventView";
import { useRouter } from "next/router";
import { z } from "zod";

const EditEventPage: NextPage = () => {
	const router = useRouter();
	const parsedId = z.string().min(1).safeParse(router.query?.id);

	return (
		<AdminRootLayout>
			{parsedId.success ? <EditEventView id={parsedId.data} /> : null}
		</AdminRootLayout>
	);
};

export default EditEventPage;
