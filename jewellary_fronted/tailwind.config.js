module.exports = {
  content: [
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
    animation: {
        'scroll-x': 'scrollX 15s linear infinite',
      },
       keyframes: {
        scrollX: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      colors: {
        primary: {
          DEFAULT: '#FF6B35', // Orange
          light: '#FF8C5A',
          dark: '#E04E1B',
        },
        secondary: {
          DEFAULT: '#FFFFFF', // White
          dark: '#F5F5F5',
        },
      },
      fontFamily: {
        futuristic: ['"Rajdhani"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}