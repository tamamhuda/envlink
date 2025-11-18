# ValidatePaymentMethodRequest

## Properties

| Name          | Type                                                                                  |
| ------------- | ------------------------------------------------------------------------------------- |
| `type`        | string                                                                                |
| `card`        | [ValidatePaymentMethodRequestCard](ValidatePaymentMethodRequestCard.md)               |
| `ewallet`     | [ValidatePaymentMethodRequestEwallet](ValidatePaymentMethodRequestEwallet.md)         |
| `directDebit` | [ValidatePaymentMethodRequestDirectDebit](ValidatePaymentMethodRequestDirectDebit.md) |

## Example

```typescript
import type { ValidatePaymentMethodRequest } from "";

// TODO: Update the object below with actual values
const example = {
  type: null,
  card: null,
  ewallet: null,
  directDebit: null,
} satisfies ValidatePaymentMethodRequest;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ValidatePaymentMethodRequest;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
