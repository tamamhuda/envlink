# Url

## Properties

| Name          | Type                                         |
| ------------- | -------------------------------------------- |
| `id`          | string                                       |
| `createdAt`   | Date                                         |
| `updatedAt`   | Date                                         |
| `code`        | string                                       |
| `originalUrl` | string                                       |
| `isAnonymous` | boolean                                      |
| `isProtected` | boolean                                      |
| `accessCode`  | string                                       |
| `expiresAt`   | any                                          |
| `clickCount`  | number                                       |
| `metadata`    | [UrlMetadata](UrlMetadata.md)                |
| `channels`    | [Array&lt;ChannelsData&gt;](ChannelsData.md) |

## Example

```typescript
import type { Url } from "";

// TODO: Update the object below with actual values
const example = {
  id: null,
  createdAt: null,
  updatedAt: null,
  code: null,
  originalUrl: null,
  isAnonymous: null,
  isProtected: null,
  accessCode: null,
  expiresAt: null,
  clickCount: null,
  metadata: null,
  channels: null,
} satisfies Url;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Url;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
