import type { Config } from "tailwindcss";
const config: Config = { content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx,mdx}"], theme: { extend: { colors: { paperGreen: "#0f8f5f", paperBlue: "#1769aa" } } }, plugins: [] };
export default config;
