# SubscriptionCycle

## Properties

| Name                     | Type                |
| ------------------------ | ------------------- |
| `id`                     | string              |
| `createdAt`              | Date                |
| `updatedAt`              | Date                |
| `subscriptionId`         | string              |
| `actionIds`              | Array&lt;string&gt; |
| `transactionId`          | string              |
| `type`                   | string              |
| `status`                 | string              |
| `paymentLinkFailedRetry` | string              |
| `cycleNumber`            | number              |
| `attemptCount`           | number              |
| `failureCode`            | string              |
| `scheduledDate`          | Date                |

## Example

```typescript
import type { SubscriptionCycle } from "";

// TODO: Update the object below with actual values
const example = {
  id: null,
  createdAt: null,
  updatedAt: null,
  subscriptionId: null,
  actionIds: null,
  transactionId: null,
  type: null,
  status: null,
  paymentLinkFailedRetry: null,
  cycleNumber: null,
  attemptCount: null,
  failureCode: null,
  scheduledDate: null,
} satisfies SubscriptionCycle;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SubscriptionCycle;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
