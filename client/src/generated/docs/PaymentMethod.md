# PaymentMethod

## Properties

| Name                 | Type                                                    |
| -------------------- | ------------------------------------------------------- |
| `id`                 | string                                                  |
| `createdAt`          | Date                                                    |
| `updatedAt`          | Date                                                    |
| `userId`             | string                                                  |
| `externalId`         | string                                                  |
| `type`               | string                                                  |
| `reusability`        | string                                                  |
| `country`            | string                                                  |
| `currency`           | string                                                  |
| `status`             | string                                                  |
| `channelCode`        | string                                                  |
| `provider`           | string                                                  |
| `failureCode`        | string                                                  |
| `customName`         | string                                                  |
| `card`               | [PaymentMethodCard](PaymentMethodCard.md)               |
| `directDebit`        | [PaymentMethodDirectDebit](PaymentMethodDirectDebit.md) |
| `ewallet`            | [PaymentMethodEwallet](PaymentMethodEwallet.md)         |
| `recurringExpiry`    | any                                                     |
| `recurringFrequency` | number                                                  |
| `isDefault`          | boolean                                                 |
| `rank`               | number                                                  |
| `metadata`           | { [key: string]: any; }                                 |

## Example

```typescript
import type { PaymentMethod } from "";

// TODO: Update the object below with actual values
const example = {
  id: null,
  createdAt: null,
  updatedAt: null,
  userId: null,
  externalId: null,
  type: null,
  reusability: null,
  country: null,
  currency: null,
  status: null,
  channelCode: null,
  provider: null,
  failureCode: null,
  customName: null,
  card: null,
  directDebit: null,
  ewallet: null,
  recurringExpiry: null,
  recurringFrequency: null,
  isDefault: null,
  rank: null,
  metadata: null,
} satisfies PaymentMethod;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as PaymentMethod;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
