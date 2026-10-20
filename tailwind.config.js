import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */

export default {
	darkMode: "class",
	content: [],

	theme: {
		extend: {
			fontFamily: {
				sans: ["Figtree", ...defaultTheme.fontFamily.sans],
			},
			gridTemplateColumns: {
				// Simple 16 column grid
				18: "repeat(18, minmax(0, 1fr))",
			},
			gridColumn: {
				"span-16": "span 16 / span 16",
				"span-14": "span 14 / span 14",
			},
		},
	},

	plugins: [forms],
};
