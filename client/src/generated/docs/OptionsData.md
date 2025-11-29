# OptionsData

## Properties

| Name              | Type    |
| ----------------- | ------- |
| `strategy`        | string  |
| `upgradable`      | boolean |
| `amount`          | number  |
| `discount`        | number  |
| `remainingDays`   | number  |
| `remainingCredit` | number  |
| `netAmount`       | number  |

## Example

```typescript
import type { OptionsData } from "";

// TODO: Update the object below with actual values
const example = {
  strategy: null,
  upgradable: null,
  amount: null,
  discount: null,
  remainingDays: null,
  remainingCredit: null,
  netAmount: null,
} satisfies OptionsData;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as OptionsData;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
