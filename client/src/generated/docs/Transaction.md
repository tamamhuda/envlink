# Transaction

## Properties

| Name                | Type   |
| ------------------- | ------ |
| `id`                | string |
| `createdAt`         | Date   |
| `updatedAt`         | Date   |
| `userId`            | string |
| `cycleId`           | string |
| `paymentMethodId`   | string |
| `subscriptionId`    | string |
| `referenceId`       | string |
| `productName`       | string |
| `amount`            | number |
| `currency`          | string |
| `status`            | string |
| `paymentMethodType` | string |
| `paymentType`       | string |
| `metadata`          | object |
| `paidAt`            | Date   |
| `failedAt`          | Date   |
| `failureCode`       | string |
| `refundedAt`        | Date   |
| `invoiceId`         | string |
| `invoiceUrl`        | string |
| `invoiceNumber`     | string |
| `invoicePdfPath`    | string |

## Example

```typescript
import type { Transaction } from "";

// TODO: Update the object below with actual values
const example = {
  id: null,
  createdAt: null,
  updatedAt: null,
  userId: null,
  cycleId: null,
  paymentMethodId: null,
  subscriptionId: null,
  referenceId: null,
  productName: null,
  amount: null,
  currency: null,
  status: null,
  paymentMethodType: null,
  paymentType: null,
  metadata: null,
  paidAt: null,
  failedAt: null,
  failureCode: null,
  refundedAt: null,
  invoiceId: null,
  invoiceUrl: null,
  invoiceNumber: null,
  invoicePdfPath: null,
} satisfies Transaction;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Transaction;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
