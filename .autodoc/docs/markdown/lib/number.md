[View code on GitHub](https://github.com/technologiestiftung/kulturdaten-frontend/blob/master/lib/number.ts)

The code above defines a custom hook called `useFormatNumber` that formats a given number according to the user's language and specified options. It uses another custom hook called `useLanguage` from the `routing` module to determine the user's language.

The `useFormatNumber` hook returns a function that takes in a number and an optional object of `Intl.NumberFormatOptions` and returns a formatted string. The `Intl.NumberFormat` constructor is used to create a new number formatter based on the user's language and the specified options. The `format` method of the number formatter is then called on the input number to produce the formatted string.

This hook can be used in various parts of the project where numbers need to be formatted based on the user's language and specific formatting options. For example, it can be used to format prices, ratings, or any other numerical data displayed on the user interface.

Here is an example of how the `useFormatNumber` hook can be used in a React component:

```
import { useFormatNumber } from './useFormatNumber';

const MyComponent = ({ price }) => {
  const formatNumber = useFormatNumber();

  return (
    <div>
      Price: {formatNumber(price, { style: 'currency', currency: 'EUR' })}
    </div>
  );
};
```

In the example above, the `useFormatNumber` hook is used to format the `price` prop as a currency in Euros. The `formatNumber` function returned by the hook is called with the `price` and the specified options, and the resulting formatted string is displayed in the component.
## Questions: 
 1. What is the purpose of the `useLanguage` function imported from `./routing`?
   - The `useLanguage` function is used to determine the language to be used for number formatting.
2. What is the expected input for the `useFormatNumber` function?
   - The `useFormatNumber` function expects a number and an optional object of `Intl.NumberFormatOptions`.
3. What is the expected output of the `useFormatNumber` function?
   - The `useFormatNumber` function returns a string representing the formatted number based on the input number and options.