# AllBillingAddressResponse

## Properties

| Name        | Type                                             |
| ----------- | ------------------------------------------------ |
| `success`   | boolean                                          |
| `status`    | number                                           |
| `path`      | string                                           |
| `data`      | [Array&lt;BillingAddress&gt;](BillingAddress.md) |
| `timestamp` | Date                                             |

## Example

```typescript
import type { AllBillingAddressResponse } from "";

// TODO: Update the object below with actual values
const example = {
  success: null,
  status: null,
  path: null,
  data: null,
  timestamp: null,
} satisfies AllBillingAddressResponse;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AllBillingAddressResponse;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
