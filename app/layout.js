import { Figtree } from "next/font/google";
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

// Apply the saved theme before the page paints, so dark mode doesn't flash light.
const themeScript = `try { document.documentElement.classList.toggle("dark", localStorage.getItem("local") === "true"); } catch {}`;

export default function RootLayout({ children }) {
	return (
		<html lang="en" className={figtree.variable} suppressHydrationWarning>
			<head>
				<script dangerouslySetInnerHTML={{ __html: themeScript }} />
			</head>
			<body className="font-sans antialiased">
				{children}
			</body>
		</html>
	);
}
