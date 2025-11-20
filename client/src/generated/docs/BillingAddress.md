# BillingAddress

## Properties

| Name         | Type    |
| ------------ | ------- |
| `id`         | string  |
| `createdAt`  | Date    |
| `updatedAt`  | Date    |
| `userId`     | string  |
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
import type { BillingAddress } from "";

// TODO: Update the object below with actual values
const example = {
  id: null,
  createdAt: null,
  updatedAt: null,
  userId: null,
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
} satisfies BillingAddress;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as BillingAddress;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
