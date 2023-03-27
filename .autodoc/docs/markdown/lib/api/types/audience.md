[View code on GitHub](https://github.com/technologiestiftung/kulturdaten-frontend/blob/master/lib/api/types/audience.ts)

The code above defines two TypeScript types: `AudienceField` and `Audience`. These types are used to represent data related to the audience of cultural events in the `kulturdaten-frontend` project.

The `AudienceField` type represents a single field of information related to an audience. It has three attributes: `type`, `key`, and `value`. The `type` attribute is a string that specifies the type of the field (e.g. "age range", "gender", etc.). The `key` attribute is a string that serves as a unique identifier for the field. The `value` attribute is a string that contains the actual value of the field (e.g. "18-24", "male", etc.).

The `Audience` type represents an audience for a cultural event. It has three attributes: `id`, `type`, and `relations`. The `id` attribute is an optional number that serves as a unique identifier for the audience. The `type` attribute is a string that specifies the type of the object (in this case, "audience"). The `relations` attribute is an object that contains information related to the audience's fields. Specifically, it has a `fields` attribute that is an array of `AudienceField` objects.

These types are used throughout the `kulturdaten-frontend` project to represent audience data. For example, they may be used in API requests and responses to retrieve and display information about audiences for cultural events. Here is an example of how the `Audience` type might be used in an API response:

```
{
  "data": {
    "id": 123,
    "type": "audience",
    "relations": {
      "fields": [
        {
          "attributes": {
            "type": "age range",
            "key": "age_range",
            "value": "18-24"
          }
        },
        {
          "attributes": {
            "type": "gender",
            "key": "gender",
            "value": "male"
          }
        }
      ]
    }
  }
}
```

In this example, the API response contains an `Audience` object with an `id` of 123 and two `AudienceField` objects representing the audience's age range and gender.
## Questions: 
 1. **What is the purpose of the AudienceField type?** The AudienceField type is used to define the attributes of a specific field within an Audience object.
2. **What is the purpose of the Audience type?** The Audience type is used to define an audience for a cultural event, including its ID, type, and related fields.
3. **How are AudienceField and Audience related?** The Audience type includes a relations property that contains an array of AudienceField objects, allowing for multiple fields to be associated with a single audience.