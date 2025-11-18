# UpgradeSubscriptionRequest

## Properties

| Name          | Type                                                                        |
| ------------- | --------------------------------------------------------------------------- |
| `plan`        | string                                                                      |
| `strategy`    | string                                                                      |
| `amount`      | number                                                                      |
| `discount`    | number                                                                      |
| `schedule`    | [UpgradeSubscriptionRequestSchedule](UpgradeSubscriptionRequestSchedule.md) |
| `description` | string                                                                      |
| `metadata`    | { [key: string]: any; }                                                     |

## Example

```typescript
import type { UpgradeSubscriptionRequest } from "";

// TODO: Update the object below with actual values
const example = {
  plan: null,
  strategy: null,
  amount: null,
  discount: null,
  schedule: null,
  description: null,
  metadata: null,
} satisfies UpgradeSubscriptionRequest;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UpgradeSubscriptionRequest;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
