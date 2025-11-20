# SubscriptionInfo

## Properties

| Name                | Type                                                    |
| ------------------- | ------------------------------------------------------- |
| `id`                | string                                                  |
| `createdAt`         | Date                                                    |
| `updatedAt`         | Date                                                    |
| `referenceId`       | string                                                  |
| `externalId`        | string                                                  |
| `userId`            | string                                                  |
| `plan`              | [SubscriptionInfoPlan](SubscriptionInfoPlan.md)         |
| `startedAt`         | Date                                                    |
| `expiresAt`         | Date                                                    |
| `remaining`         | number                                                  |
| `status`            | string                                                  |
| `isTrial`           | boolean                                                 |
| `schedule`          | [SubscriptionInfoSchedule](SubscriptionInfoSchedule.md) |
| `metadata`          | { [key: string]: any; }                                 |
| `transactionStatus` | string                                                  |
| `nextBillingDate`   | Date                                                    |
| `actions`           | [Array&lt;ActionsData&gt;](ActionsData.md)              |

## Example

```typescript
import type { SubscriptionInfo } from "";

// TODO: Update the object below with actual values
const example = {
  id: null,
  createdAt: null,
  updatedAt: null,
  referenceId: null,
  externalId: null,
  userId: null,
  plan: null,
  startedAt: null,
  expiresAt: null,
  remaining: null,
  status: null,
  isTrial: null,
  schedule: null,
  metadata: null,
  transactionStatus: null,
  nextBillingDate: null,
  actions: null,
} satisfies SubscriptionInfo;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SubscriptionInfo;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
