import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Poppins'", "sans-serif"],
        body: ["'Inter'", "sans-serif"]
      },
      colors: {
        ink: {
          900: "#09090b",
          700: "#18181b",
          500: "#27272a"
        },
        accent: {
          500: "#38bdf8",
          600: "#0ea5e9",
          700: "#0284c7"
        }
      },
      boxShadow: {
        float: "0 20px 45px -20px rgba(56, 189, 248, 0.35)"
      }
    }
  },
  plugins: []
};

export default config;
