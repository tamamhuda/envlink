# UrlAnalyticStat

## Properties

| Name             | Type                                                                                        |
| ---------------- | ------------------------------------------------------------------------------------------- |
| `url`            | [UrlAnalyticStatUrl](UrlAnalyticStatUrl.md)                                                 |
| `totalVisit`     | number                                                                                      |
| `uniqueVisitors` | number                                                                                      |
| `firstVisit`     | Date                                                                                        |
| `lastVisit`      | Date                                                                                        |
| `deviceVisits`   | [{ [key: string]: UrlAnalyticStatDeviceVisitsValue; }](UrlAnalyticStatDeviceVisitsValue.md) |
| `osVisits`       | [{ [key: string]: UrlAnalyticStatDeviceVisitsValue; }](UrlAnalyticStatDeviceVisitsValue.md) |
| `browserVisits`  | [{ [key: string]: UrlAnalyticStatDeviceVisitsValue; }](UrlAnalyticStatDeviceVisitsValue.md) |
| `countryVisits`  | [Array&lt;CountryVisitsData&gt;](CountryVisitsData.md)                                      |

## Example

```typescript
import type { UrlAnalyticStat } from "";

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
} satisfies UrlAnalyticStat;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UrlAnalyticStat;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
