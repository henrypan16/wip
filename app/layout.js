import { Figtree } from "next/font/google";
import ThemeInitializer from "@/components/ThemeInitializer";
import "./globals.css";

const figtree = Figtree({
	subsets: ["latin"],
	weight: ["400", "500", "600"],
	variable: "--font-figtree",
});

export const metadata = {
	title: {
		template: "FTWIP - %s",
		default: "FTWIP",
	},
};

export default function RootLayout({ children }) {
	return (
		<html lang="en" className={figtree.variable} suppressHydrationWarning>
			<body className="font-sans antialiased">
				<ThemeInitializer />
				{children}
			</body>
		</html>
	);
}
