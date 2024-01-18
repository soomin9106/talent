import type { Config } from 'tailwindcss'

const withMT = require("@material-tailwind/react/utils/withMT");

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
    colors: {
      lightGray: "#B2B2B2",
      white: "#FFFFFF",
      black: "#333",
      brown: "#AF8762",
      naturalGray: "#6F767E",
      green: "#88F256",
      yellow: "#F9F017"
    }
  },
  plugins: [],
}
export default withMT(config)
