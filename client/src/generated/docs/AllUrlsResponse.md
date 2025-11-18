# AllUrlsResponse

## Properties

| Name        | Type                       |
| ----------- | -------------------------- |
| `success`   | boolean                    |
| `status`    | number                     |
| `path`      | string                     |
| `data`      | [Array&lt;Url&gt;](Url.md) |
| `timestamp` | Date                       |

## Example

```typescript
import type { AllUrlsResponse } from "";

// TODO: Update the object below with actual values
const example = {
  success: null,
  status: null,
  path: null,
  data: null,
  timestamp: null,
} satisfies AllUrlsResponse;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AllUrlsResponse;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
