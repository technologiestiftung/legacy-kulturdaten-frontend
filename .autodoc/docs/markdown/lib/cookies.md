[View code on GitHub](https://github.com/technologiestiftung/kulturdaten-frontend/blob/master/lib/cookies.ts)

The code above defines three functions related to browser cookies: `getCookie`, `setCookie`, and `deleteCookie`. These functions are used to retrieve, create, and delete cookies, respectively. 

The `Cookie` type is defined as an object with four optional properties: `name`, `value`, `path`, `domain`, and `max-age`. The `name` and `value` properties are required, while the other properties are optional. 

The `getCookie` function takes a `name` parameter and returns a `Cookie` object that describes the browser cookie with the specified name. The function first checks if the `document` object is defined (i.e., if the code is running in a browser environment). If it is, the function splits the `document.cookie` string into an array of individual cookies, filters the array to find the cookie with the specified name, and reduces the filtered array to a single `Cookie` object. If the `document` object is not defined, the function returns `undefined`.

The `setCookie` function takes a `Cookie` object as a parameter and sets a new cookie in the browser with the specified properties. The function uses the `document.cookie` property to set the cookie string with the `name`, `value`, `path`, `domain`, and `max-age` properties. 

The `deleteCookie` function takes a `Cookie` object as a parameter and deletes the browser cookie with the specified name. The function sets the `document.cookie` property to a string that includes the `name`, `path`, and `domain` properties, as well as an `expires` property set to a date in the past. This causes the browser to delete the cookie. 

These functions are likely used throughout the larger project to manage user authentication and session data. For example, the `setCookie` function may be used to create a cookie that stores a user's authentication token, while the `getCookie` function may be used to retrieve that token when the user navigates to a new page. The `deleteCookie` function may be used to log the user out by deleting the authentication token cookie.
## Questions: 
 1. What is the purpose of the `Cookie` type and how is it used in this code?
   
   The `Cookie` type is a TypeScript interface that defines the structure of a browser cookie. It is used as the input and output type for the `getCookie`, `setCookie`, and `deleteCookie` functions.

2. How does the `getCookie` function work and what does it return?
   
   The `getCookie` function takes a string `name` as input and returns a `Cookie` object that describes the browser cookie with the matching name. It does this by first checking if the `document` object is defined (i.e. if the code is running in a browser environment), then splitting the `document.cookie` string into an array of individual cookies, filtering that array to only include the cookie with the matching name, and finally reducing that filtered array into a single `Cookie` object.

3. What is the purpose of the `max-age` property in the `setCookie` function and how is it used?
   
   The `max-age` property is an optional number that represents the maximum age of the cookie in seconds. It is used to set the `Max-Age` attribute of the cookie in the `document.cookie` string. If `maxAge` is defined, the `Max-Age` attribute is set to that value, otherwise it is omitted.