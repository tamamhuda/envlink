# PaymentMethodCard

## Properties

| Name               | Type   |
| ------------------ | ------ |
| `network`          | string |
| `issuer`           | string |
| `cardType`         | string |
| `maskedCardNumber` | string |
| `expiryMonth`      | string |
| `expiryYear`       | string |
| `cardHolderName`   | string |

## Example

```typescript
import type { PaymentMethodCard } from "";

// TODO: Update the object below with actual values
const example = {
  network: null,
  issuer: null,
  cardType: null,
  maskedCardNumber: null,
  expiryMonth: null,
  expiryYear: null,
  cardHolderName: null,
} satisfies PaymentMethodCard;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as PaymentMethodCard;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
