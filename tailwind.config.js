module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
  theme: {
    extend: {
      colors: {
        primary: '#242424',
        gray: {
          1: '#EAEAEA',
          2: '#ACB5BD',
          3: '#838A90',
          4: '#2B2F35',
        },
      },
      borderWidth: {
        '05': '0.5px',
      },
    },
  },
};
