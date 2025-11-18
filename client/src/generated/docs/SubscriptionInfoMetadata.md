# SubscriptionInfoMetadata

## Properties

| Name           | Type   |
| -------------- | ------ |
| `strategy`     | string |
| `previousPlan` | string |
| `newPlan`      | string |

## Example

```typescript
import type { SubscriptionInfoMetadata } from "";

// TODO: Update the object below with actual values
const example = {
  strategy: null,
  previousPlan: null,
  newPlan: null,
} satisfies SubscriptionInfoMetadata;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SubscriptionInfoMetadata;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
