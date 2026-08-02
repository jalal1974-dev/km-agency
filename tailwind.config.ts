import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101828",
        muted: "#667085",
        line: "#E4E7EC",
        brand: {
          50: "#F1F7FF",
          100: "#DDEBFF",
          500: "#2563EB",
          600: "#1D4ED8",
          900: "#122048"
        },
        coral: "#F9735B",
        gold: "#D6A84F"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(16, 24, 40, 0.10)"
      },
      borderRadius: {
        ui: "8px"
      }
    }
  },
  plugins: []
};

export default config;
