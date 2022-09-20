/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				"primary-darker": "#0C2340",
				"primary-lighter": "#179BD5",
				paper: "#faebd7",
			},
			fontFamily: {
				opensans: ["Open Sans", "sans-serif"],
				raleway: ["Raleway", "sans-serif"],
			},
		},
	},
	plugins: [],
};
