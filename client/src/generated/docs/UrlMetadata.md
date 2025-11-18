# UrlMetadata

## Properties

| Name          | Type   |
| ------------- | ------ |
| `title`       | string |
| `description` | string |
| `image`       | string |
| `favicon`     | string |
| `siteName`    | string |

## Example

```typescript
import type { UrlMetadata } from "";

// TODO: Update the object below with actual values
const example = {
  title: null,
  description: null,
  image: null,
  favicon: null,
  siteName: null,
} satisfies UrlMetadata;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UrlMetadata;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
