/** @type {import("tailwindcss").Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
	darkMode: "class",
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		screens: {
			"xs": "450px",
			...defaultTheme.screens,
		},
		extend: {
			boxShadow: {
				"inner-md": "inset 1px 4px 6px 0 rgb(0 0 0 / 0.1)",
				"inner-md-2": "inset 2px 2px 6px 0 rgb(0 0 0 / 0.15)",
				"inner-md-3": "inset 2px 4px 6px 0 rgb(0 0 0 / 0.21)",
				"inner-md-4": "inset 2px 4px 10px 0 rgb(0 0 0 / 0.28)",
				"inner-lg": "inset 4px 5px 7px 0 rgb(0 0 0 / 0.2)",
				"inner-xl": "inset 4px 9px 9px 0 rgb(0 0 0 / 0.3)",
				"inner-2xl": "inset 4px 11px 12px 0 rgb(0 0 0 / 0.3)",
			},

			colors: {
				darken: "#00000066",
				twitch: {
					DEFAULT: "#9146FF",
					light: "#9147ff",
					dark: "#772ce8",
				},
				accent: {
					DEFAULT: "#f15a22",
					100: "#fcded3",
					200: "#f9bda7",
					300: "#f79c7a",
					400: "#f47b4e",
					500: "#f15a22",
					600: "#c1481b",
					700: "#913614",
					800: "#60240e",
					900: "#301207",
				},
				primary: {
					50: "#C4D4E6",
					100: "#84A0C1",
					200: "#5C7D9E",
					300: "#34526F",
					400: "#213659",
					500: "#162448",
					600: "#0F1E40",
					700: "#0A1939",
					800: "#051330",
					900: "#040D29",
					DEFAULT: "#0C2340",
				},
				secondary: {
					DEFAULT: "#179bd5",
					100: "#d1ebf7",
					200: "#a2d7ee",
					300: "#74c3e6",
					400: "#45afdd",
					500: "#179bd5",
					600: "#127caa",
					700: "#0e5d80",
					800: "#093e55",
					900: "#051f2b",
				},
				paper: "#faebd7",
			},
			fontFamily: {
				opensans: ["\"Open Sans\"", "sans-serif"],
				inter: ["\"Inter\"", "sans-serif"],
				mono: ["\"Roboto Mono\"", "monospace"],
				raleway: ["\"Raleway\"", "sans-serif"],
				roboto: ["\"Roboto\""],
			},
		},
	},
	plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
};
