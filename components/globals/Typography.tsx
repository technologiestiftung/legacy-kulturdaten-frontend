import { Global, css } from '@emotion/react';

const fontFamily = 'IBM Plex Sans';

export const Typography: React.FC = () => (
  <Global
    styles={css`
      @font-face {
        font-family: ${fontFamily};
        src: url('/fonts/IBMPlexSans-Text-Latin1.woff2') format('woff2'),
          url('/fonts/IBMPlexSans-Text-Latin1.woff') format('woff');
        font-weight: 500;
        font-display: auto;
        font-style: normal;
      }
      @font-face {
        font-family: ${fontFamily};
        src: url('/fonts/IBMPlexSans-TextItalic-Latin1.woff2') format('woff2'),
          url('/fonts/IBMPlexSans-TextItalic-Latin1.woff') format('woff');
        font-weight: 500;
        font-display: auto;
        font-style: italic;
      }
      @font-face {
        font-family: ${fontFamily};
        src: url('/fonts/IBMPlexSans-SemiBold-Latin1.woff2') format('woff2'),
          url('/fonts/IBMPlexSans-SemiBold-Latin1.woff') format('woff');
        font-weight: 700;
        font-display: auto;
        font-style: normal;
      }
      @font-face {
        font-family: ${fontFamily};
        src: url('/fonts/IBMPlexSans-SemiBoldItalic-Latin1.woff2') format('woff2'),
          url('/fonts/IBMPlexSans-SemiBoldItalic-Latin1.woff') format('woff');
        font-weight: 700;
        font-display: auto;
        font-style: italic;
      }

      html {
        font-family: ${fontFamily}, Helvetica, sans-serif;
        font-weight: var(--font-weight-normal);
        box-sizing: border-box;
        font-smoothing: antialiased;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
        font-feature-settings: 'liga' on;
      }
    `}
  />
);
