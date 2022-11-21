/** @type {import("tailwindcss").Config} */
module.exports = {
	darkMode: "class",
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			boxShadow: {
				'inner-md': 'inset 1px 4px 6px 0 rgb(0 0 0 / 0.1)',
				'inner-md-2': 'inset 2px 2px 6px 0 rgb(0 0 0 / 0.15)',
				'inner-md-3': 'inset 2px 4px 6px 0 rgb(0 0 0 / 0.21)',
				'inner-md-4': 'inset 2px 4px 10px 0 rgb(0 0 0 / 0.28)',
				'inner-lg': 'inset 4px 5px 7px 0 rgb(0 0 0 / 0.2)',
				'inner-xl': 'inset 4px 9px 9px 0 rgb(0 0 0 / 0.3)',
				'inner-2xl': 'inset 4px 11px 12px 0 rgb(0 0 0 / 0.3)'
			},
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
