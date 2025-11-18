# HealthCheck503Response

## Properties

| Name      | Type                                                                                        |
| --------- | ------------------------------------------------------------------------------------------- |
| `status`  | string                                                                                      |
| `info`    | [{ [key: string]: HealthCheck200ResponseErrorValue; }](HealthCheck200ResponseErrorValue.md) |
| `error`   | [{ [key: string]: HealthCheck200ResponseErrorValue; }](HealthCheck200ResponseErrorValue.md) |
| `details` | [{ [key: string]: HealthCheck200ResponseErrorValue; }](HealthCheck200ResponseErrorValue.md) |

## Example

```typescript
import type { HealthCheck503Response } from "";

// TODO: Update the object below with actual values
const example = {
  status: error,
  info: { database = { status = up } },
  error: { redis: { status: "down", message: "Could not connect" } },
  details: {
    database: { status: "up" },
    redis: { status: "down", message: "Could not connect" },
  },
} satisfies HealthCheck503Response;

console.log(example);

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example);
console.log(exampleJSON);

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as HealthCheck503Response;
console.log(exampleParsed);
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
