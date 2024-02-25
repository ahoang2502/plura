import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";

import { ThemeProvider } from "@/providers/theme-provider";
import "./globals.css";
import ModalProvider from "@/providers/modal-providers";
import { Toaster } from "@/components/ui/toaster";

const font = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Plura",
	description: "All-in-one Agency Solution",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={font.className}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<ModalProvider>
						{children}

						<Toaster />
					</ModalProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
