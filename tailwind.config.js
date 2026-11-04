/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', md: '2rem', xl: '2.5rem' },
      // Content width follows the root font size, so wide laptops/monitors scale up
      // with the type instead of leaving the layout stuck at 1280px.
      screens: { '2xl': '88rem' },
    },
    extend: {
      colors: {
        // Brand palette = the three colours of the HISS logo: white, green, red.
        //
        // Primary – logo green. 600 = #006638 (sampled from the HISS logo)
        brand: {
          50: '#e6f4ec',
          100: '#c4e5d2',
          200: '#8fcba8',
          300: '#52a97c',
          400: '#1f8758',
          500: '#0a7444',
          600: '#006638',
          700: '#00522d',
          800: '#003f23',
          900: '#002d19',
          950: '#001a0f',
        },
        // Secondary – logo red. 600 = #e11b22 (sampled from the HISS logo)
        accent: {
          50: '#fff0f0',
          100: '#ffdcdd',
          200: '#ffb4b6',
          300: '#ff8387',
          400: '#f24a50',
          500: '#ea2a31',
          600: '#e11b22',
          700: '#b9131a',
          800: '#8f0f14',
          900: '#6b0c10',
        },
        // Pale blue-grey panel colour used behind "About" (#cedfea)
        mist: {
          DEFAULT: '#cedfea',
          light: '#e6eff5',
        },
        // Body text colour (the7 "base color" #24343f)
        ink: {
          DEFAULT: '#24343f',
          muted: '#5b6b76',
        },
        // Section background on the live site (#ecf2f0)
        surface: {
          DEFAULT: '#ecf2f0',
          soft: '#f4f8f6',
          muted: '#e0e9e6',
        },
      },
      fontFamily: {
        // The reference site uses Cairo. It ships Arabic and Latin glyphs, so one stack serves AR + EN.
        sans: ['Cairo', 'Tajawal', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Cairo', 'Tajawal', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        soft: '0 8px 30px -8px rgb(36 52 63 / 0.18)',
        'soft-lg': '0 20px 50px -15px rgb(36 52 63 / 0.28)',
        luxe: '0 40px 70px -30px rgb(0 45 25 / 0.4), 0 12px 24px -12px rgb(36 52 63 / 0.15)',
        card: '0 1px 0 0 rgb(255 255 255) inset, 0 18px 40px -22px rgb(36 52 63 / 0.28)',
        glow: '0 0 0 1px rgb(225 27 34 / 0.3), 0 12px 40px -8px rgb(225 27 34 / 0.45)',
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(135deg, #f24a50 0%, #e11b22 55%, #b9131a 100%)',
        'brand-gradient': 'linear-gradient(135deg, #003320 0%, #00522d 50%, #006638 100%)',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  // The stock `container` pads per breakpoint with fixed px widths. Ours is fluid:
  // the gutter and max width follow the viewport / root font size, so every laptop
  // gets the same proportions. `--gutter` lets full-bleed children (carousels) line up.
  corePlugins: { container: false },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        '.container': {
          '--gutter': 'clamp(1.25rem, 3.2vw, 2.75rem)',
          width: '100%',
          maxWidth: '88rem',
          marginInline: 'auto',
          paddingInline: 'var(--gutter)',
        },
      });
    },
  ],
};
