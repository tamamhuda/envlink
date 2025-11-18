# PaginatedLinks

## Properties

| Name    | Type   |
| ------- | ------ |
| `first` | string |
| `prev`  | string |
| `next`  | string |
| `last`  | string |

## Example

```typescript
import type { PaginatedLinks } from "";

// TODO: Update the object below with actual values
const example = {
  first: null,
  prev: null,
  next: null,
  last: null,
} satisfies PaginatedLinks;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as PaginatedLinks;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
