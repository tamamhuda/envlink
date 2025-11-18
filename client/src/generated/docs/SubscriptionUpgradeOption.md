# SubscriptionUpgradeOption

## Properties

| Name              | Type                                       |
| ----------------- | ------------------------------------------ |
| `id`              | string                                     |
| `createdAt`       | Date                                       |
| `updatedAt`       | Date                                       |
| `name`            | string                                     |
| `limit`           | number                                     |
| `resetInterval`   | string                                     |
| `cost`            | number                                     |
| `chargeOnSuccess` | boolean                                    |
| `description`     | string                                     |
| `price`           | number                                     |
| `features`        | Array&lt;string&gt;                        |
| `upgradable`      | boolean                                    |
| `options`         | [Array&lt;OptionsData&gt;](OptionsData.md) |

## Example

```typescript
import type { SubscriptionUpgradeOption } from "";

// TODO: Update the object below with actual values
const example = {
  id: null,
  createdAt: null,
  updatedAt: null,
  name: null,
  limit: null,
  resetInterval: null,
  cost: null,
  chargeOnSuccess: null,
  description: null,
  price: null,
  features: null,
  upgradable: null,
  options: null,
} satisfies SubscriptionUpgradeOption;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SubscriptionUpgradeOption;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
