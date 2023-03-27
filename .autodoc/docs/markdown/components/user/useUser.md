[View code on GitHub](https://github.com/technologiestiftung/kulturdaten-frontend/blob/master/components/user/useUser.ts)

The code above is a module that exports two hooks: `useUser` and `useUserOrganizerLists`. These hooks are used to access user information and organizer lists in the Kulturdaten Frontend project.

The `useUser` hook returns an object with the following properties:

- `user`: the current user object
- `authToken`: the authentication token for the current user
- `isLoggedIn`: a boolean indicating whether the user is authenticated
- `login`: a function to log in the user
- `logout`: a function to log out the user
- `mutateUserInfo`: a function to update the user information
- `isSuperuser`: a boolean indicating whether the user is a superuser

The `useUserOrganizerLists` hook returns an object with three properties:

- `all`: an array of all organizers associated with the current user
- `owner`: an array of organizers for which the current user is an owner
- `contributor`: an array of organizers for which the current user is a contributor

The `useUser` hook uses the `useContext` and `useMemo` hooks from React to access the `UserContext` and `AdminContext` contexts, as well as the `useSetOrganizerId` hook from the `useOrganizer` module. It also uses the `getConfig` function from the `next/config` module to get the public runtime configuration.

The `useUserOrganizerLists` hook uses the `useUser` hook to get the current user object, and then uses the `useMemo` hook to filter the organizers associated with the user by owner and contributor roles.

These hooks are used throughout the Kulturdaten Frontend project to manage user authentication and access to organizer information. For example, the `useUser` hook is used in the `Header` component to display the user's name and profile picture, and the `useUserOrganizerLists` hook is used in the `OrganizerList` component to display the user's organizers.
## Questions: 
 1. What is the purpose of the `useUser` hook?
   - The `useUser` hook returns an object with information about the currently logged in user, including their user object, authentication token, login/logout functions, and whether they are a superuser.
2. What is the purpose of the `useUserOrganizerLists` hook?
   - The `useUserOrganizerLists` hook returns an object with arrays of organizers that the user owns or contributes to, as well as all organizers that the user is associated with.
3. What is the purpose of the `publicRuntimeConfig` variable?
   - The `publicRuntimeConfig` variable is used to access configuration values that are set at runtime, such as the name of the authentication token cookie. It is retrieved using the `getConfig` function from the `next/config` module.