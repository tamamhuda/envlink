# SubscriptionInfoPlan

## Properties

| Name              | Type                |
| ----------------- | ------------------- |
| `name`            | string              |
| `limit`           | number              |
| `resetInterval`   | string              |
| `cost`            | number              |
| `chargeOnSuccess` | boolean             |
| `description`     | string              |
| `price`           | number              |
| `features`        | Array&lt;string&gt; |
| `cta`             | string              |
| `popular`         | boolean             |

## Example

```typescript
import type { SubscriptionInfoPlan } from "";

// TODO: Update the object below with actual values
const example = {
  name: null,
  limit: null,
  resetInterval: null,
  cost: null,
  chargeOnSuccess: null,
  description: null,
  price: null,
  features: null,
  cta: null,
  popular: null,
} satisfies SubscriptionInfoPlan;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SubscriptionInfoPlan;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
