# Authenticated

## Properties

| Name     | Type                                          |
| -------- | --------------------------------------------- |
| `tokens` | [AuthenticatedTokens](AuthenticatedTokens.md) |
| `user`   | [AuthenticatedUser](AuthenticatedUser.md)     |

## Example

```typescript
import type { Authenticated } from "";

// TODO: Update the object below with actual values
const example = {
  tokens: null,
  user: null,
} satisfies Authenticated;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as Authenticated;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
