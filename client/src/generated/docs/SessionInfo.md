# SessionInfo

## Properties

| Name         | Type                                  |
| ------------ | ------------------------------------- |
| `id`         | string                                |
| `createdAt`  | Date                                  |
| `updatedAt`  | Date                                  |
| `userAgent`  | string                                |
| `ipLocation` | string                                |
| `isRevoked`  | boolean                               |
| `isCurrent`  | boolean                               |
| `deviceType` | string                                |
| `os`         | string                                |
| `browser`    | string                                |
| `revokedAt`  | Date                                  |
| `expiresAt`  | Date                                  |
| `user`       | [SessionInfoUser](SessionInfoUser.md) |

## Example

```typescript
import type { SessionInfo } from "";

// TODO: Update the object below with actual values
const example = {
  id: null,
  createdAt: null,
  updatedAt: null,
  userAgent: null,
  ipLocation: null,
  isRevoked: null,
  isCurrent: null,
  deviceType: null,
  os: null,
  browser: null,
  revokedAt: null,
  expiresAt: null,
  user: null,
} satisfies SessionInfo;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SessionInfo;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
