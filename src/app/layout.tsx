import { ReactNode } from "react";
import { ClientProvider } from "@/app/ClientProvider";
import "@/styles/globals.scss";

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<ClientProvider>
			<html lang="en">
				<body>{children}</body>
			</html>
		</ClientProvider>
	);
}
