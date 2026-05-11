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
        brand: {
          primary: "#10b981", // Emerald 500
          secondary: "#0ea5e9", // Sky 500
          accent: "#f59e0b", // Amber 500
        },
      },
    },
  },
  plugins: [],
};
export default config;
