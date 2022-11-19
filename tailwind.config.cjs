/** @type {import("tailwindcss").Config} */
module.exports = {
	darkMode: "class",
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			screens: {
				"xs": "450px",
			},
			colors: {
				accent: "#f15a22",
				primary: {
					dark: "#0C2340",
					"dark-hover": "#0f2c50",
					light: "#179BD5",
					"light-hover": "#179BD5",
				},
				paper: "#faebd7"
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
