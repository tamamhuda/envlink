# SessionInfoUser

## Properties

| Name          | Type                                                    |
| ------------- | ------------------------------------------------------- |
| `id`          | string                                                  |
| `createdAt`   | Date                                                    |
| `updatedAt`   | Date                                                    |
| `customerId`  | string                                                  |
| `email`       | string                                                  |
| `username`    | string                                                  |
| `fullName`    | string                                                  |
| `phoneNumber` | string                                                  |
| `role`        | string                                                  |
| `avatar`      | string                                                  |
| `providers`   | [SessionInfoUserProviders](SessionInfoUserProviders.md) |
| `lastLoginAt` | Date                                                    |

## Example

```typescript
import type { SessionInfoUser } from "";

// TODO: Update the object below with actual values
const example = {
  id: null,
  createdAt: null,
  updatedAt: null,
  customerId: null,
  email: null,
  username: null,
  fullName: null,
  phoneNumber: null,
  role: null,
  avatar: null,
  providers: null,
  lastLoginAt: null,
} satisfies SessionInfoUser;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SessionInfoUser;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
