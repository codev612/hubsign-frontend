import { nextui } from "@nextui-org/theme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      layout: {
        disabledOpacity: "0.3", // opacity-[0.3]
        fontSize: {
          tiny: "12px", // text-tiny
          small: "14px", // text-small
          medium: "16px", // text-medium
          large: "24px", // text-large
          vlarge: "32px",//text-vlarge
        },
        radius: {
          small: "2px", // rounded-small
          medium: "8px", // rounded-medium
          large: "6px", // rounded-large
        },
        borderWidth: {
          small: "1px", // border-small
          medium: "1px", // border-medium
          large: "2px", // border-large
        },
      },
      themes: {
        light: {
          colors: {
            background: "#E6E6E6",
            forecolor: "#F4F4F4",
            text: "#525252",
            primary: "#2563EB",
            error: "#f31260",
            link: "#2563EB",
            bgdanger: "#FCE9EA",
            info: "#A1E2A1",
          },
        },
        dark: {},
      },
    }),
  ],
};
