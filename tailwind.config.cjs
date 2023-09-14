/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		screens: {
			xs: "450px",
			...defaultTheme.screens,
		},
		extend: {
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				darken: "#00000066",
				twitch: {
					DEFAULT: "#9146FF",
					light: "#9147ff",
					dark: "#772ce8",
				},
				"portal-accent": {
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
				"portal-primary": {
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
				"portal-secondary": {
					DEFAULT: "#179bd5",
					50: "#ebf4fc",
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
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			boxShadow: {
				"inner-md": "inset 1px 4px 6px 0 rgb(0 0 0 / 0.1)",
				"inner-md-2": "inset 2px 2px 6px 0 rgb(0 0 0 / 0.15)",
				"inner-md-3": "inset 2px 4px 6px 0 rgb(0 0 0 / 0.21)",
				"inner-md-4": "inset 2px 4px 10px 0 rgb(0 0 0 / 0.28)",
				"inner-lg": "inset 4px 5px 7px 0 rgb(0 0 0 / 0.2)",
				"inner-xl": "inset 4px 9px 9px 0 rgb(0 0 0 / 0.3)",
				"inner-2xl": "inset 4px 11px 12px 0 rgb(0 0 0 / 0.3)",
			},
			fontFamily: {
				opensans: ['"Open Sans"', "sans-serif"],
				inter: ['"Inter"', "sans-serif"],
				mono: ['"Roboto Mono"', "monospace"],
				raleway: ['"Raleway"', "sans-serif"],
				roboto: ['"Roboto"'],
			},
			keyframes: {
				"accordion-down": {
					from: { height: 0 },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: 0 },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
			},
		},
	},
	plugins: [
		require("tailwindcss-animate"),
		require("@tailwindcss/typography"),
		require("@tailwindcss/forms"),
	],
};
