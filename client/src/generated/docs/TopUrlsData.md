# TopUrlsData

## Properties

| Name             | Type                                                                                                  |
| ---------------- | ----------------------------------------------------------------------------------------------------- |
| `url`            | [TopUrlsDataUrl](TopUrlsDataUrl.md)                                                                   |
| `totalVisit`     | number                                                                                                |
| `uniqueVisitors` | number                                                                                                |
| `firstVisit`     | Date                                                                                                  |
| `lastVisit`      | Date                                                                                                  |
| `deviceVisits`   | [{ [key: string]: UrlAnalyticsSegmentsDeviceVisitsValue; }](UrlAnalyticsSegmentsDeviceVisitsValue.md) |
| `osVisits`       | [{ [key: string]: UrlAnalyticsSegmentsDeviceVisitsValue; }](UrlAnalyticsSegmentsDeviceVisitsValue.md) |
| `browserVisits`  | [{ [key: string]: UrlAnalyticsSegmentsDeviceVisitsValue; }](UrlAnalyticsSegmentsDeviceVisitsValue.md) |
| `countryVisits`  | [Array&lt;TopUrlsDataCountryVisitsInner&gt;](TopUrlsDataCountryVisitsInner.md)                        |
| `referrerVisits` | [{ [key: string]: UrlAnalyticsSegmentsDeviceVisitsValue; }](UrlAnalyticsSegmentsDeviceVisitsValue.md) |
| `regionVisits`   | [Array&lt;TopUrlsDataRegionVisitsInner&gt;](TopUrlsDataRegionVisitsInner.md)                          |
| `cityVisits`     | [Array&lt;TopUrlsDataCityVisitsInner&gt;](TopUrlsDataCityVisitsInner.md)                              |

## Example

```typescript
import type { TopUrlsData } from "";

// TODO: Update the object below with actual values
const example = {
  url: null,
  totalVisit: null,
  uniqueVisitors: null,
  firstVisit: null,
  lastVisit: null,
  deviceVisits: null,
  osVisits: null,
  browserVisits: null,
  countryVisits: null,
  referrerVisits: null,
  regionVisits: null,
  cityVisits: null,
} satisfies TopUrlsData;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as TopUrlsData;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
