import { Global, css, SerializedStyles } from '@emotion/react';
import { breakpoints, Breakpoint } from '../../lib/WindowService';

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
        --black-o25: rgba(17, 17, 17, 0.25);
        --black-o70: rgba(17, 17, 17, 0.7);
        --yellow: #e6ea81;
        --green-light: #41b496;
        --green-mid: #46948c;
        --red: #e60032;
        --error: #ae0026;
        --red-50: #f28098;
        --blue: #1e3791;

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

        --app-height: 100vh;

        --transition-duration: 0.125s;

        --shadow: 2px 2px 10px -4px var(--black-o70);
        --shadow-hover: 2px 2px 12px -2px var(--black-o70);
        --shadow-active: 2px 2px 8px -4px var(--black-o70);
        --shadow-inset: inset 0px 1px 6px var(--black-o25);

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

export const mq = (breakpoint: Breakpoint): string =>
  `@media screen and (min-width: ${breakpoints[breakpoint]}px)`;

export const contentGrid = (columnCount: number): SerializedStyles => css`
  display: grid;
  grid-template-columns: repeat(${columnCount}, 1fr);
  column-gap: 0;
`;
