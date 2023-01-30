import { ReactNode } from "react";
import { ClientProvider } from "@/app/ClientProvider";
import "@/styles/globals.scss";
import { NProgressProvider } from "@/app/NProgressProvider";

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<ClientProvider>
			<NProgressProvider>
				<html lang="en">
					<body>{children}</body>
				</html>
			</NProgressProvider>
		</ClientProvider>
	);
}
