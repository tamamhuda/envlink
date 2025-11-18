# UrlAnalyticsOverview

## Properties

| Name             | Type                                                 |
| ---------------- | ---------------------------------------------------- |
| `totalVisits`    | number                                               |
| `uniqueVisitors` | number                                               |
| `topCountries`   | [Array&lt;TopCountriesData&gt;](TopCountriesData.md) |
| `topUrls`        | [Array&lt;TopUrlsData&gt;](TopUrlsData.md)           |

## Example

```typescript
import type { UrlAnalyticsOverview } from "";

// TODO: Update the object below with actual values
const example = {
  totalVisits: null,
  uniqueVisitors: null,
  topCountries: null,
  topUrls: null,
} satisfies UrlAnalyticsOverview;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UrlAnalyticsOverview;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
