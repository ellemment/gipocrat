// gipocrat/app/ellemment-ui/styles/tailwind-preset.ts

import { type Config } from 'tailwindcss'
import { colors } from './colors'
// Import other theme parts 
// import { typography } from './typography'
// import { spacing } from './spacing'
// import { borderRadius } from './border-radius'
// import { shadows } from './shadows'
// import { animations } from './animations'

export const ellemmentPreset = {
  theme: {
    extend: {
      colors,
      // Add other theme extensions as you create them
      // typography,
      // spacing,
      // borderRadius,
      // boxShadow: shadows,
      // animation: animations,
    },
  },
  plugins: [
    // Add any custom plugins here
  ],
} satisfies Omit<Config, 'content'>

export default ellemmentPreset