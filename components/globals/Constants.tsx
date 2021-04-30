import { Global, css } from '@emotion/react';

export const CSSVars: React.FC = () => (
  <Global
    styles={css`
      html {
        --white: #f9f9f9;
        --grey-200: #e6e6e6;
        --grey-350: #c8c8c8;
        --grey-400: #aaaaaa;
        --grey-600: #474747;
        --black: #111111;
        --yellow: #e6ea81;
        --green: #41b496;
        --red: #e60032;
        --cyan-dark: #2e91d2;
        --mustard: #dcc82d;

        --font-weight-normal: 500;
        --font-weight-bold: 700;
        --font-size-200: 0.75rem;
        --line-height-200: 1.5rem;
        --font-size-300: 0.875rem;
        --line-height-300: 1.5rem;
        --font-size-400: 1rem;
        --line-height-400: 1.5rem;
        --font-size-600: 1.1125rem;
        --line-height-600: 1.5rem;
        --font-size-700: 1.5rem;
        --line-height-700: 2.25rem;

        @media screen and (min-width: 768px) {
          --font-size-600: 1.5rem;
          --line-height-600: 2.25rem;
          --font-size-700: 2rem;
          --line-height-700: 3rem;
        }
      }
    `}
  />
);
