# TopCountriesData

## Properties

| Name          | Type   |
| ------------- | ------ |
| `country`     | string |
| `totalVisits` | number |

## Example

```typescript
import type { TopCountriesData } from "";

// TODO: Update the object below with actual values
const example = {
  country: null,
  totalVisits: null,
} satisfies TopCountriesData;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as TopCountriesData;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
