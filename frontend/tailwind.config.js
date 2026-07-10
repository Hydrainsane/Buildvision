/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    extend: {
      fontFamily: {
        display: ["Sora", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
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
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        navy: {
          50: "#EEF3FA",
          100: "#D6E2F2",
          200: "#AEC5E5",
          300: "#82A4D6",
          400: "#5580BF",
          500: "#33619F",
          600: "#234A80",
          700: "#183761",
          800: "#122A49",
          850: "#0F2540",
          900: "#0A1B30",
          950: "#060F1C",
        },
        brand: {
          50: "#EBF2FE",
          100: "#D6E4FD",
          200: "#ADC9FB",
          300: "#7EA9F6",
          400: "#4C82F0",
          500: "#2F6FED",
          600: "#1E54C7",
          700: "#17419C",
          800: "#123274",
          900: "#0E2758",
        },
        risk: {
          high: "#DC2626",
          "high-soft": "#FEE2E2",
          medium: "#F59E0B",
          "medium-soft": "#FEF3C7",
          low: "#16A34A",
          "low-soft": "#DCFCE7",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 6px)",
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(15, 37, 64, 0.04), 0 1px 6px -1px rgba(15, 37, 64, 0.06)",
        panel: "0 4px 24px -4px rgba(15, 37, 64, 0.10)",
        glow: "0 0 0 3px rgba(47, 111, 237, 0.15)",
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
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: 0.8 },
          "80%, 100%": { transform: "scale(1.8)", opacity: 0 },
        },
        "fade-in": {
          from: { opacity: 0, transform: "translateY(4px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        "grow-bar": {
          from: { width: 0 },
          to: { width: "var(--target-width)" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-ring": "pulse-ring 1.8s cubic-bezier(0.2,0.6,0.35,1) infinite",
        "fade-in": "fade-in 0.4s ease-out",
        scan: "scan 2.8s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
