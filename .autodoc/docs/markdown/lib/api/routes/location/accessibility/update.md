[View code on GitHub](https://github.com/technologiestiftung/kulturdaten-frontend/blob/master/lib/api/routes/location/accessibility/update.ts)

This code defines a type and a factory function for making API calls to update the accessibility information of a location. It is part of the larger kulturdaten-frontend project and relies on other modules and types defined within the project.

The `LocationAccessibilityUpdate` type extends the `ApiCall` type and specifies the request and response formats for updating the accessibility information of a location. The request includes a route, method, headers (including an authorization token), and a body containing the new accessibility information. The response includes a status code of 200 and a body containing the updated location data and a success message.

The `locationAccessibilityUpdateFactory` function takes an authorization token and a query object containing the location ID and the new accessibility information. It returns an object conforming to the `LocationAccessibilityUpdate` type, with the request fields populated using the `apiRoutes` module to generate the appropriate URL and the `makeBearer` function to add the authorization token to the headers.

This code can be used in the larger project to update the accessibility information of a location. The `locationAccessibilityUpdateFactory` function can be called with the necessary parameters to generate an API call object, which can then be passed to a function that sends the request to the server and handles the response. The `LocationAccessibilityUpdate` type can also be used to ensure that the request and response formats are correctly defined and validated.
## Questions: 
 1. What is the purpose of the `LocationAccessibilityUpdate` type?
   - The `LocationAccessibilityUpdate` type is used to define the structure of an API call for updating the accessibility information of a location.
2. What is the `locationAccessibilityUpdateFactory` function used for?
   - The `locationAccessibilityUpdateFactory` function is used to create an instance of the `LocationAccessibilityUpdate` type with the provided token and query parameters.
3. What is the expected response format for the `LocationAccessibilityUpdate` API call?
   - The expected response format for the `LocationAccessibilityUpdate` API call is a 200 status code with a body containing the updated location data and a meta message indicating the success of the update.