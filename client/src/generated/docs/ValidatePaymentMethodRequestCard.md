# ValidatePaymentMethodRequestCard

## Properties

| Name               | Type   |
| ------------------ | ------ |
| `cardType`         | string |
| `maskedCardNumber` | string |
| `expiryMonth`      | string |
| `expiryYear`       | string |

## Example

```typescript
import type { ValidatePaymentMethodRequestCard } from "";

// TODO: Update the object below with actual values
const example = {
  cardType: null,
  maskedCardNumber: null,
  expiryMonth: null,
  expiryYear: null,
} satisfies ValidatePaymentMethodRequestCard;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(
  exampleJSON,
) as ValidatePaymentMethodRequestCard;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
