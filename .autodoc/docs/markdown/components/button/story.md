[View code on GitHub](https://github.com/technologiestiftung/kulturdaten-frontend/blob/master/components/button/story.tsx)

This code defines a set of stories for the `Button` component of the `kulturdaten-frontend` project. The `Button` component is imported from the same file, along with several related enums: `ButtonColor`, `ButtonSize`, `ButtonVariant`, and `IconPosition`. The `styled` function is also imported from the `@emotion/styled` package.

The `Button` component is used in several different ways in the defined stories, with different sizes, colors, and variants. Each story is defined as a function component that returns a set of `Button` components wrapped in a `TestWrapper` component. The `TestWrapper` component is a styled `div` that takes two optional props: `background` and `color`. It is used to provide a consistent layout and styling for the `Button` components in each story.

The `ButtonStory` story defines a set of `Button` components with the default size, color, and variant. Each `Button` has an `onClick` handler that logs a message to the console when clicked, and some of them also have an `icon` prop that specifies an icon to display next to the button text.

The `ButtonMinimalStory` and `ButtonBorderlessStory` stories define sets of `Button` components with the `minimal` and `borderless` variants, respectively. These variants remove the background and border of the `Button` component, leaving only the text and icon. The `ButtonMinimalStory` also demonstrates how the `TestWrapper` component can be used with different background and text colors.

The `ButtonSmallStory` and `ButtonBigStory` stories define sets of `Button` components with the `small` and `big` sizes, respectively. These sizes adjust the padding and font size of the `Button` component to make it smaller or larger. The `ButtonSmallStory` also demonstrates how the `color` and `iconPosition` props can be used to customize the appearance of the `Button` component.

Overall, these stories provide a comprehensive set of examples for how the `Button` component can be used in the `kulturdaten-frontend` project, with different sizes, colors, and variants. They also demonstrate how the `TestWrapper` component can be used to provide a consistent layout and styling for the `Button` components in each story.
## Questions: 
 1. What is the purpose of the `Button` component and what are its available props?
- The `Button` component is used to render a button element with various styles and configurations. Its available props include `color`, `size`, `variant`, `icon`, and `iconPosition`.
2. What is the purpose of the `TestWrapper` component and what are its available props?
- The `TestWrapper` component is used to wrap the `Button` components and apply styles to them. Its available props include `background` and `color`.
3. What is the purpose of the different story components (`ButtonStory`, `ButtonMinimalStory`, etc.) and how do they differ from each other?
- The different story components are used to showcase the `Button` component with different configurations and styles. They differ from each other in terms of the `size`, `variant`, and `color` props that are passed to the `Button` component.