# UrlAnalyticTimeline

## Properties

| Name           | Type   |
| -------------- | ------ |
| `totalVisits`  | number |
| `uniqueVisits` | number |
| `timestamp`    | Date   |

## Example

```typescript
import type { UrlAnalyticTimeline } from "";

// TODO: Update the object below with actual values
const example = {
  totalVisits: null,
  uniqueVisits: null,
  timestamp: null,
} satisfies UrlAnalyticTimeline;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UrlAnalyticTimeline;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
