# UrlAnalyticStatUrl

## Properties

| Name          | Type                                                        |
| ------------- | ----------------------------------------------------------- |
| `id`          | string                                                      |
| `code`        | string                                                      |
| `originalUrl` | string                                                      |
| `channels`    | [Array&lt;ChannelsData&gt;](ChannelsData.md)                |
| `metadata`    | [UrlAnalyticStatUrlMetadata](UrlAnalyticStatUrlMetadata.md) |

## Example

```typescript
import type { UrlAnalyticStatUrl } from "";

// TODO: Update the object below with actual values
const example = {
  id: null,
  code: null,
  originalUrl: null,
  channels: null,
  metadata: null,
} satisfies UrlAnalyticStatUrl;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UrlAnalyticStatUrl;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
