# PublicUrl

## Properties

| Name          | Type                                      |
| ------------- | ----------------------------------------- |
| `createdAt`   | Date                                      |
| `updatedAt`   | Date                                      |
| `code`        | string                                    |
| `originalUrl` | string                                    |
| `isAnonymous` | boolean                                   |
| `isProtected` | boolean                                   |
| `expiresAt`   | any                                       |
| `clickCount`  | number                                    |
| `metadata`    | [PublicUrlMetadata](PublicUrlMetadata.md) |

## Example

```typescript
import type { PublicUrl } from "";

// TODO: Update the object below with actual values
const example = {
  createdAt: null,
  updatedAt: null,
  code: null,
  originalUrl: null,
  isAnonymous: null,
  isProtected: null,
  expiresAt: null,
  clickCount: null,
  metadata: null,
} satisfies PublicUrl;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as PublicUrl;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
