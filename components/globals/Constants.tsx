import { Global, css, SerializedStyles } from '@emotion/react';
import { breakpoints, Breakpoint } from '../../lib/WindowService';
import { fontFamily, fontFamilyMono } from './Typography';

export const CSSVars: React.FC = () => (
  <Global
    styles={css`
      html {
        --white: #f8f8f8;
        --white-o0: rgba(248, 248, 248, 0);
        --white-o50: rgba(248, 248, 248, 0.5);
        --white-o85: rgba(248, 248, 248, 0.85);
        --white-red: rgb(247, 244, 244);
        --white-green: rgb(243, 246, 245);
        --white-green-o50: rgba(243, 246, 245, 0.5);
        --grey-100: #eaeaea;
        --grey-200: #e6e6e6;
        --grey-350: #c8c8c8;
        --grey-400: #cbcbcb;
        --grey-500: #808080;
        --grey-600: #474747;
        --grey-700: #2d2d2d;
        --black: #1a1a1a;
        --black-o25: rgba(0, 0, 0, 0.25);
        --black-o40: rgba(0, 0, 0, 0.4);
        --black-o70: rgba(0, 0, 0, 0.7);
        --yellow: #f0d909;
        --yellow-light: #fcea83;
        --yellow-dark: #a7ad00;
        --green-light: #41b496;
        --green-mid: #46948c;
        --green-kelly: #91c882;
        --green-publish: #00835c;
        --red: #b01e1e;
        --red-publish: #e60032;
        --error: #ae0026;
        --error-light: #ff6c8c;
        --error-o50: rgba(174, 0, 38, 0.5);
        --red-50: #f28098;
        --blue: #1e3791;

        --cyan-dark: #2e91d2;
        --mustard: #dcc82d;

        --font-weight-normal: 500;
        --font-weight-bold: 700;
        --font-size-100: 0.6875rem;
        --line-height-100: 0.75rem;
        --font-size-200: 0.8125rem;
        --line-height-200: 1.5rem;
        --font-size-300: 0.875rem;
        --line-height-300: 1.5rem;
        --font-size-400: 1rem;
        --line-height-400: 1.5rem;
        --font-size-500: 1.125rem;
        --line-height-500: 1.5rem;
        --font-size-600: 1.125rem;
        --line-height-600: 1.5rem;
        --font-size-650: 1.375rem;
        --line-height-650: 2.25rem;
        --font-size-700: 1.5rem;
        --line-height-700: 2.25rem;
        --font-size-1000: 2.75rem;
        --line-height-1000: 3.75rem;

        --font-family: ${fontFamily}, Helvetica, sans-serif;
        --font-family-mono: ${fontFamilyMono}, Courier, monospace;

        --app-height: 100vh;

        --transition-duration: 0.125s;
        --transition-duration-fast: 0.03125s;

        --shadow: 0.125rem 0.125rem 10px -0.25rem var(--black-o70);
        --shadow-hover: 0.125rem 0.125rem 0.75rem -0.125rem var(--black-o70);
        --shadow-active: 0.125rem 0.125rem 0.5rem -0.25rem var(--black-o70);
        --shadow-inset: inset 0px 0.0625rem 0.375rem var(--black-o25);
        --shadow-light: 0.125rem 0.125rem 10px -0.125rem var(--black-o40);
        --shadow-sharp-hover: 0 0 0 0.25rem rgba(0, 0, 0, 0.25);
        --shadow-sharp-active: 0 0 0 0.25rem rgba(0, 0, 0, 0.5);

        --overlay-opacity: 0.75;

        --header-height: 3.75rem;
        --organizer-band-width: 4.5rem;

        --max-content-width: 80rem;

        @media screen and (min-width: 52.5rem) {
          --font-size-600: 1.5rem;
          --line-height-600: 2.25rem;
          --font-size-650: 1.875rem;
          --line-height-650: 3rem;
          --font-size-700: 2.25rem;
          --line-height-700: 3rem;
          --font-size-1000: 4rem;
          --line-height-1000: 5.25rem;
        }

        @media screen and (min-width: 75rem) {
          --font-size-1000: 4.5rem;
          --line-height-1000: 5.25rem;
        }

        @media screen and (min-width: 100rem) {
          --font-size-1000: 5rem;
          --line-height-1000: 6rem;
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

const defaultShadowColor = 'var(--grey-400)';

const shadowMap4 = (shadowColor = defaultShadowColor) => ({
  top: `inset 0px 0.0625rem 0px ${shadowColor}`,
  right: `inset -0.0625rem 0px 0px ${shadowColor}`,
  bottom: `inset 0px -0.0625rem 0px ${shadowColor}`,
  left: `inset 0.0625rem 0px 0px ${shadowColor}`,
});

const shadowMap2 = (shadowColor = defaultShadowColor) => ({
  topBottom: `${shadowMap4(shadowColor).top}, ${shadowMap4(shadowColor).bottom}`,
  rightLeft: `${shadowMap4(shadowColor).right}, ${shadowMap4(shadowColor).left}`,
});

const shadowMap1 = (shadowColor = defaultShadowColor) =>
  `inset 0px 0px 0px 0.0625rem ${shadowColor}`;

/**
 * Creates border like attributes to be used with css `box-shadow`
 * @param sides - Defines for 1 to 4 sides to have a border or not. Following CSS padding and margin logic: [true/false] controls all sides. [true/false, true/false] controls vertical and horizontal, [true/false, true/false, true/false, true/false] controls individual sides clockwise starting from top
 * @returns
 */
export const insetBorder = (...sides: boolean[]): string => {
  switch (sides.length) {
    case 1: {
      return sides[0] ? shadowMap1() : '';
    }

    case 2:
    case 3:
    case 4:
    default: {
      return sides
        .reduce<string>((combined, value, index) => {
          const shadow =
            sides.length === 2
              ? Object.values(shadowMap2())[index]
              : Object.values(shadowMap4())[index];
          if (value && shadow) {
            return `${shadow}, ${combined}`;
          } else {
            return combined;
          }
        }, '')
        .slice(0, -2);
    }
  }
};

export const insetBorderColored = (color: string, ...sides: boolean[]): string => {
  switch (sides.length) {
    case 1: {
      return sides[0] ? shadowMap1(color) : '';
    }

    case 2:
    case 3:
    case 4:
    default: {
      return sides
        .reduce<string>((combined, value, index) => {
          const shadow =
            sides.length === 2
              ? Object.values(shadowMap2(color))[index]
              : Object.values(shadowMap4(color))[index];
          if (value && shadow) {
            return `${shadow}, ${combined}`;
          } else {
            return combined;
          }
        }, '')
        .slice(0, -2);
    }
  }
};

export const overlayStyles = css`
  background: #000;
  opacity: var(--overlay-opacity);
`;
