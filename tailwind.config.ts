import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                midnight: {
                    900: "#0a192f", // Deepest background
                    800: "#112240", // Card background
                    700: "#233554", // Border/Hover
                },
                gold: {
                    400: "#fbbf24",
                    500: "#f59e0b", // Primary Brand
                    600: "#d97706",
                },
                navy: {
                    50: "#f0f9ff",
                    100: "#e0f2fe",
                    900: "#0c4a6e",
                }
            },
            fontFamily: {
                sans: ["var(--font-inter)", "sans-serif"],
            },
        },
    },
    plugins: [],
};
export default config;
