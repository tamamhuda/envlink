# UrlAnalyticLog

## Properties

| Name           | Type                                         |
| -------------- | -------------------------------------------- |
| `id`           | string                                       |
| `createdAt`    | Date                                         |
| `updatedAt`    | Date                                         |
| `ipAddress`    | string                                       |
| `userAgent`    | string                                       |
| `referrer`     | string                                       |
| `region`       | string                                       |
| `city`         | string                                       |
| `country`      | string                                       |
| `deviceType`   | string                                       |
| `os`           | string                                       |
| `language`     | string                                       |
| `isUnique`     | boolean                                      |
| `browser`      | string                                       |
| `visitorCount` | number                                       |
| `urlId`        | string                                       |
| `channels`     | [Array&lt;ChannelsData&gt;](ChannelsData.md) |

## Example

```typescript
import type { UrlAnalyticLog } from "";

// TODO: Update the object below with actual values
const example = {
  id: null,
  createdAt: null,
  updatedAt: null,
  ipAddress: null,
  userAgent: null,
  referrer: null,
  region: null,
  city: null,
  country: null,
  deviceType: null,
  os: null,
  language: null,
  isUnique: null,
  browser: null,
  visitorCount: null,
  urlId: null,
  channels: null,
} satisfies UrlAnalyticLog;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UrlAnalyticLog;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
