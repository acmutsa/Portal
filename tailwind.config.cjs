/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			screens: {
				'xs': '450px'
			},
			colors: {
				"accent": "#f15a22",
				"primary-darker": "#0C2340",
				"primary-lighter": "#179BD5",
				paper: "#faebd7",
			},
			fontFamily: {
				opensans: ['"Open Sans"', "sans-serif"],
				inter: ['"Inter"', "sans-serif"],
				mono: ['"Roboto Mono"', "monospace"],
				raleway: ['"Raleway"', "sans-serif"],
				roboto: ['"Roboto"'],
			},
		},
	},
	plugins: [require("@tailwindcss/typography")],
};
