module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // ✅ 扫描 src 下所有组件
  ],
  theme: {
  extend: {
    colors: {
      base: '#FFF8E1',
      primary: '#3F51B5',
      secondary: '#7986CB',
      accent: '#F3E5F5',
      text: '#3F51B5',
    },
  },
},

  plugins: [],
}