# PublicSubscriptionsPlansApi

All URIs are relative to *https://local-nest.utadev.app*

| Method                                                    | HTTP request                                      | Description              |
| --------------------------------------------------------- | ------------------------------------------------- | ------------------------ |
| [**getAll**](PublicSubscriptionsPlansApi.md#getall)       | **GET** /api/v1/public/subscriptions/plans        | Get all plan details     |
| [**getByName**](PublicSubscriptionsPlansApi.md#getbyname) | **GET** /api/v1/public/subscriptions/plans/{name} | Get plan details by name |

## getAll

> AllPlansResponse getAll()

Get all plan details

### Example

```ts
import { Configuration, PublicSubscriptionsPlansApi } from "";
import type { GetAllRequest } from "";

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PublicSubscriptionsPlansApi();

  try {
    const data = await api.getAll();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**AllPlansResponse**](AllPlansResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description              | Response headers |
| ----------- | ------------------------ | ---------------- |
| **200**     | Get all plan details suc | -                |
| **4XX**     | API Error Response       | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

## getByName

> PlanResponse getByName(name)

Get plan details by name

### Example

```ts
import { Configuration, PublicSubscriptionsPlansApi } from "";
import type { GetByNameRequest } from "";

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PublicSubscriptionsPlansApi();

  const body = {
    // string
    name: name_example,
  } satisfies GetByNameRequest;

  try {
    const data = await api.getByName(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

| Name     | Type     | Description | Notes                     |
| -------- | -------- | ----------- | ------------------------- |
| **name** | `string` |             | [Defaults to `undefined`] |

### Return type

[**PlanResponse**](PlanResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description                   | Response headers |
| ----------- | ----------------------------- | ---------------- |
| **200**     | Get plan details successfully | -                |
| **4XX**     | API Error Response            | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
