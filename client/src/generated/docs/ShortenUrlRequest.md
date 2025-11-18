# ShortenUrlRequest

## Properties

| Name          | Type                |
| ------------- | ------------------- |
| `code`        | string              |
| `originalUrl` | string              |
| `isProtected` | boolean             |
| `accessCode`  | string              |
| `expiresAt`   | Date                |
| `channelIds`  | Array&lt;string&gt; |

## Example

```typescript
import type { ShortenUrlRequest } from "";

// TODO: Update the object below with actual values
const example = {
  code: null,
  originalUrl: null,
  isProtected: null,
  accessCode: null,
  expiresAt: null,
  channelIds: null,
} satisfies ShortenUrlRequest;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ShortenUrlRequest;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
