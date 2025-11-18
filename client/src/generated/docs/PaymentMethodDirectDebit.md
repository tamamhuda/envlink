# PaymentMethodDirectDebit

## Properties

| Name                | Type   |
| ------------------- | ------ |
| `bankAccountNumber` | string |
| `bankAccountHash`   | string |

## Example

```typescript
import type { PaymentMethodDirectDebit } from "";

// TODO: Update the object below with actual values
const example = {
  bankAccountNumber: null,
  bankAccountHash: null,
} satisfies PaymentMethodDirectDebit;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as PaymentMethodDirectDebit;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
