/** @type {import('tailwindcss').Config} */
import {platformSelect} from 'nativewind/theme';

module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        poppinsBlack: platformSelect({
          ios: ['Poppins-Black'],
          android: ['Poppins-Black'],
          default: ['Poppins-Black'],
        }),
        poppinsBlackItalic: platformSelect({
          ios: ['Poppins-BlackItalic'],
          android: ['Poppins-BlackItalic'],
          default: ['Poppins-BlackItalic'],
        }),
        poppinsBold: platformSelect({
          ios: ['Poppins-Bold'],
          android: ['Poppins-Bold'],
          default: ['Poppins-Bold'],
        }),
        poppinsBoldItalic: platformSelect({
          ios: ['Poppins-BoldItalic'],
          android: ['Poppins-BoldItalic'],
          default: ['Poppins-BoldItalic'],
        }),
        poppinsLight: platformSelect({
          ios: ['Poppins-Light'],
          android: ['Poppins-Light'],
          default: ['Poppins-Light'],
        }),
        poppins: platformSelect({
          ios: ['Poppins-Medium'],
          android: ['Poppins-Medium'],
          default: ['Poppins-Medium'],
        }),
        // Add more fonts as needed
      },
      // fontSize: {
      //   sm: `${normalize(12)}px`,
      //   base: `${normalize(14)}px`,
      //   lg: `${normalize(16)}px`,
      //   xl: `${normalize(18)}px`,
      // },
      // spacing: {
      //   1: `${normalize(4)}px`,
      //   2: `${normalize(8)}px`,
      //   3: `${normalize(12)}px`,
      //   4: `${normalize(16)}px`,
      //   5: `${normalize(20)}px`,
      //   6: `${normalize(24)}px`,
      // },
    },
  },
  plugins: [],
};
