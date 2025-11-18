# UpdateUrlRequest

## Properties

| Name          | Type                                                    |
| ------------- | ------------------------------------------------------- |
| `code`        | string                                                  |
| `originalUrl` | string                                                  |
| `isAnonymous` | boolean                                                 |
| `isProtected` | boolean                                                 |
| `accessCode`  | string                                                  |
| `expiresAt`   | any                                                     |
| `metadata`    | [UpdateUrlRequestMetadata](UpdateUrlRequestMetadata.md) |
| `channels`    | [Array&lt;ChannelsData&gt;](ChannelsData.md)            |

## Example

```typescript
import type { UpdateUrlRequest } from "";

// TODO: Update the object below with actual values
const example = {
  code: null,
  originalUrl: null,
  isAnonymous: null,
  isProtected: null,
  accessCode: null,
  expiresAt: null,
  metadata: null,
  channels: null,
} satisfies UpdateUrlRequest;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UpdateUrlRequest;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
