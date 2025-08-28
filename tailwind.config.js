module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'stat-primary': '#6a5acd',
        'stat-primary-50': '#f1f0fb',
        'stat-primary-100': '#e5e3f7', 
        'stat-primary-400': '#8a7bea',
        'stat-secondary': '#5e5c7f',
        'stat-font': '#2d2a45',
        'stat-bg': '#f5f6f7',
        'stat-old-bg': '#ebfaff'
      },
      fontFamily: {
        'noto': ['Noto Sans', 'sans-serif']
      },
      spacing: {
        '2xs': '3px',
        'xs': '6px', 
        '1sm': '8px',
        '2sm': '10px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px'
      }
    },
  },
  plugins: [],
}