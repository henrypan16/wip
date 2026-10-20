"use client";

import { useEffect } from "react";

export default function ThemeInitializer() {
	useEffect(() => {
		try {
			const isDark = localStorage.getItem("local") === "true";

			document.documentElement.classList.toggle("dark", isDark);
		} catch (error) {
			console.error("Failed to initialize theme:", error);
		}
	}, []);

	return null;
}
