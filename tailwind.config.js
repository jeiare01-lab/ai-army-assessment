export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        pgb: {
          navy: '#0D1B3D',
          cream: '#FEF9F3',
          orange: '#E65100',
        }
      },
      fontFamily: {
        fraunces: ['Fraunces', 'serif'],
        plex: ['IBM Plex Sans', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
