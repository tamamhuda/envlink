# UpdateBillingAddressRequest

## Properties

| Name         | Type    |
| ------------ | ------- |
| `customName` | string  |
| `firstName`  | string  |
| `lastName`   | string  |
| `phone`      | string  |
| `address`    | string  |
| `address2`   | string  |
| `city`       | string  |
| `state`      | string  |
| `country`    | string  |
| `zip`        | string  |
| `isDefault`  | boolean |

## Example

```typescript
import type { UpdateBillingAddressRequest } from "";

// TODO: Update the object below with actual values
const example = {
  customName: null,
  firstName: null,
  lastName: null,
  phone: null,
  address: null,
  address2: null,
  city: null,
  state: null,
  country: null,
  zip: null,
  isDefault: null,
} satisfies UpdateBillingAddressRequest;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UpdateBillingAddressRequest;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
