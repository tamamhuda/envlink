# HealthApi

All URIs are relative to *https://local-nest.utadev.app*

| Method                                      | HTTP request           | Description         |
| ------------------------------------------- | ---------------------- | ------------------- |
| [**healthCheck**](HealthApi.md#healthcheck) | **GET** /api/v1/health | Check health status |

## healthCheck

> HealthCheck200Response healthCheck()

Check health status

### Example

```ts
import { Configuration, HealthApi } from "";
import type { HealthCheckRequest } from "";

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new HealthApi();

  try {
    const data = await api.healthCheck();
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

[**HealthCheck200Response**](HealthCheck200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`

### HTTP response details

| Status code | Description                        | Response headers |
| ----------- | ---------------------------------- | ---------------- |
| **200**     | The Health Check is successful     | -                |
| **503**     | The Health Check is not successful | -                |
| **4XX**     | API Error Response                 | -                |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)
